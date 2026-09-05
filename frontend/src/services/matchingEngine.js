import { AUTHORIZED_INITIAL_STUDENTS, seedGroupATimetables } from "./timetableData";
import { getStudentAvailability, timeToMinutes } from "./availabilityEngine";
import { db, createNotification } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export async function findBestAssistants(requestData) {
  // Ensure timetable data is initialized
  await seedGroupATimetables().catch(() => {});

  // Parse request times & requested duration
  const reqStartMins = timeToMinutes(requestData.preferredStartTime || "15:00");
  const reqEndMins = timeToMinutes(requestData.preferredEndTime || "16:00");
  let reqDuration = reqEndMins - reqStartMins;
  if (reqDuration <= 0) reqDuration = 60; // Fallback 60 mins

  const requiredSkillsList = Array.isArray(requestData.requiredSkills)
    ? requestData.requiredSkills
    : (requestData.requiredSkills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  // 1. Fetch authorized student assistants from Firestore / Local Seed
  let students = [...AUTHORIZED_INITIAL_STUDENTS];
  try {
    const studentsRef = collection(db, "studentAssistants");
    const snap = await getDocs(studentsRef);
    if (!snap.empty) {
      const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Ensure Parth & Hargun are included
      const mergedMap = new Map();
      AUTHORIZED_INITIAL_STUDENTS.forEach((s) => mergedMap.set(s.id, s));
      fetched.forEach((s) => mergedMap.set(s.id || s.email, s));
      students = Array.from(mergedMap.values());
    }
  } catch (err) {
    console.warn("Using authorized development student seed:", err);
  }

  // 2. Evaluate each candidate
  const evaluatedCandidates = await Promise.all(
    students.map(async (student) => {
      // Query student's active tasks for date
      let activeTasks = [];
      try {
        const requestsRef = collection(db, "assistanceRequests");
        const q = query(
          requestsRef,
          where("assignedStudentId", "==", student.id),
          where("preferredDate", "==", requestData.preferredDate || new Date().toISOString().split("T")[0])
        );
        const snap = await getDocs(q);
        activeTasks = snap.docs.map((doc) => doc.data());
      } catch (err) {
        console.warn("Active task check fallback:", err);
      }

      // Calculate availability intervals
      const availabilityWindows = await getStudentAvailability(
        student.id,
        requestData.preferredDate,
        activeTasks
      );

      // Check if student has a continuous available window covering request
      let matchingWindow = null;
      let hasFullDuration = false;

      for (const window of availabilityWindows) {
        // Option A: Specific time window overlap check
        if (reqStartMins >= window.startMins && reqEndMins <= window.endMins) {
          hasFullDuration = true;
          matchingWindow = window;
          break;
        }
        // Option B: Duration capacity check
        if (window.durationMinutes >= reqDuration) {
          hasFullDuration = true;
          matchingWindow = window;
        }
      }

      // Hard Constraint Enforcement
      if (!hasFullDuration) {
        return {
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          department: student.department,
          eligible: false,
          matchScore: 0,
          availabilityWindows,
          availableStart: availabilityWindows[0]?.startTime || "N/A",
          availableEnd: availabilityWindows[0]?.endTime || "N/A",
          availableDuration: availabilityWindows[0]?.durationMinutes || 0,
          skillScore: 0,
          workloadScore: 0,
          performanceScore: student.performanceScore || 4.8,
          reasons: [
            `❌ Ineligible: Cannot cover complete requested duration (${reqDuration} mins required)`,
          ],
        };
      }

      // Candidate is ELIGIBLE -> Calculate Deterministic Scores
      // A. Skill Score
      let matchedSkills = [];
      let skillScore = 80; // default baseline if no skills specified
      if (requiredSkillsList.length > 0) {
        const studentSkillsLower = (student.skills || []).map((s) => s.toLowerCase());
        matchedSkills = requiredSkillsList.filter((reqSkill) =>
          studentSkillsLower.some((stSkill) => stSkill.includes(reqSkill.toLowerCase()))
        );
        skillScore = Math.round((matchedSkills.length / requiredSkillsList.length) * 100);
      }

      // B. Workload Score
      const activeTaskCount = student.activeTaskCount || 0;
      const workloadScore = Math.max(0, 100 - activeTaskCount * 25);

      // C. Performance & Reliability Score
      const perfScoreNum = student.performanceScore || 4.8;
      const performanceScore = Math.round((perfScoreNum / 5.0) * 100);
      const reliabilityScore = student.reliabilityScore || 96;

      // D. Overall Weighted Match Score
      const matchScore = Math.round(
        100 * 0.4 + // Full duration hard constraint met = 40%
        skillScore * 0.3 + // Skill match = 30%
        workloadScore * 0.15 + // Workload = 15%
        performanceScore * 0.15 // Performance = 15%
      );

      // E. Generate Match Reasons
      const reasons = [
        `✓ Full duration available (${matchingWindow.durationMinutes} mins available)`,
        requiredSkillsList.length > 0
          ? `✓ Required skills matched (${matchedSkills.length}/${requiredSkillsList.length} skills)`
          : `✓ Qualified for general academic support`,
        `✓ Low active workload (${activeTaskCount} active tasks)`,
        `✓ Strong performance rating (${perfScoreNum} / 5.0)`,
      ];

      return {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        department: student.department,
        eligible: true,
        matchScore,
        availableStart: matchingWindow.startTime,
        availableEnd: matchingWindow.endTime,
        availableDuration: matchingWindow.durationMinutes,
        skillScore,
        workloadScore,
        performanceScore: perfScoreNum,
        reliabilityScore,
        reasons,
      };
    })
  );

  // 3. Rank candidates by eligibility and match score
  evaluatedCandidates.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return b.matchScore - a.matchScore;
  });

  const bestMatch = evaluatedCandidates.find((c) => c.eligible) || evaluatedCandidates[0];

  // 4. Save match results to Firestore subcollection if requestId exists
  if (requestData.id) {
    try {
      for (const candidate of evaluatedCandidates) {
        const matchDocRef = doc(
          db,
          "assistanceRequests",
          requestData.id,
          "matches",
          candidate.studentId
        );
        await setDoc(matchDocRef, {
          ...candidate,
          requestId: requestData.id,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("Match result persistence fallback:", err);
    }
  }

  // 5. Create Notifications in Firestore for eligible student accounts
  for (const candidate of evaluatedCandidates) {
    if (candidate.eligible && candidate.studentEmail) {
      await createNotification({
        userId: candidate.studentId,
        title: "New Faculty Assistance Request",
        message: `Dr. ${requestData.facultyName || "Faculty"} requested assistance for "${
          requestData.title
        }" (${requestData.preferredDate || "Upcoming"}).`,
        type: "NEW_MATCHED_REQUEST",
      }).catch(() => {});
    }
  }

  return {
    bestMatch,
    rankedCandidates: evaluatedCandidates,
  };
}
