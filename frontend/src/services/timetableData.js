import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export const PERIOD_TIMINGS = [
  { period: 1, startTime: "08:45", endTime: "09:45", label: "Period I (08:45-09:45)" },
  { period: 2, startTime: "09:45", endTime: "10:45", label: "Period II (09:45-10:45)" },
  { period: 3, startTime: "10:45", endTime: "11:45", label: "Period III (10:45-11:45)" },
  { period: 4, startTime: "11:45", endTime: "12:45", label: "Period IV (11:45-12:45)" },
  { period: 5, startTime: "13:00", endTime: "14:00", label: "Period V (13:00-14:00)" },
  { period: 6, startTime: "14:00", endTime: "15:00", label: "Period VI (14:00-15:00)" },
  { period: 7, startTime: "15:00", endTime: "16:00", label: "Period VII (15:00-16:00)" },
  { period: 8, startTime: "16:00", endTime: "17:00", label: "Period VIII (16:00-17:00)" },
];

export const GROUP_A_TIMETABLE_ENTRIES = {
  Monday: [
    { period: 1, subject: "DS (Th)", isOccupied: true },
    { period: 2, subject: "DS (Th)", isOccupied: true },
    { period: 3, subject: "DM Lab (Gp A)", isOccupied: true },
    { period: 4, subject: "DM Lab (Gp A)", isOccupied: true },
    { period: 5, subject: "VAC", isOccupied: true },
    { period: 6, subject: "VAC", isOccupied: true },
    { period: 7, subject: "FREE", isOccupied: false },
    { period: 8, subject: "FREE", isOccupied: false },
  ],
  Tuesday: [
    { period: 1, subject: "DM (Th)", isOccupied: true },
    { period: 2, subject: "DM (Th)", isOccupied: true },
    { period: 3, subject: "DS Lab (Gp A)", isOccupied: true },
    { period: 4, subject: "DS Lab (Gp A)", isOccupied: true },
    { period: 5, subject: "AI (Th)", isOccupied: true },
    { period: 6, subject: "VAC", isOccupied: true },
    { period: 7, subject: "VAC", isOccupied: true },
    { period: 8, subject: "FREE", isOccupied: false },
  ],
  Wednesday: [
    { period: 1, subject: "FREE", isOccupied: false },
    { period: 2, subject: "OS (Th)", isOccupied: true },
    { period: 3, subject: "OS (Th)", isOccupied: true },
    { period: 4, subject: "AI Lab (Gp A)", isOccupied: true },
    { period: 5, subject: "AI Lab (Gp A)", isOccupied: true },
    { period: 6, subject: "SEC", isOccupied: true },
    { period: 7, subject: "SEC", isOccupied: true },
    { period: 8, subject: "SEC", isOccupied: true },
  ],
  Thursday: [
    { period: 1, subject: "EVS", isOccupied: true },
    { period: 2, subject: "DM (Th)", isOccupied: true },
    { period: 3, subject: "OS Lab (Gp A)", isOccupied: true },
    { period: 4, subject: "OS Lab (Gp A)", isOccupied: true },
    { period: 5, subject: "DS (Th)", isOccupied: true },
    { period: 6, subject: "SEC", isOccupied: true },
    { period: 7, subject: "SEC", isOccupied: true },
    { period: 8, subject: "FREE", isOccupied: false },
  ],
  Friday: [
    { period: 1, subject: "FREE", isOccupied: false },
    { period: 2, subject: "OS (Th)", isOccupied: true },
    { period: 3, subject: "AI (Th)", isOccupied: true },
    { period: 4, subject: "AI (Th)", isOccupied: true },
    { period: 5, subject: "EVS", isOccupied: true },
    { period: 6, subject: "EVS", isOccupied: true },
    { period: 7, subject: "FREE", isOccupied: false },
    { period: 8, subject: "FREE", isOccupied: false },
  ],
};

export const AUTHORIZED_INITIAL_STUDENTS = [
  {
    id: "parth_254012",
    name: "Parth",
    email: "parth.254012@sggscc.ac.in",
    department: "B.Sc. (Hons.) Computer Science",
    course: "B.Sc. (Hons.) Computer Science",
    semester: "III",
    group: "A",
    skills: ["Python", "SQL", "DBMS", "Java", "Lab Assistance"],
    availabilityStatus: "Available (Group A)",
    isAvailable: true,
    activeTaskCount: 0,
    completedTaskCount: 12,
    performanceScore: 4.9,
    reliabilityScore: 98,
  },
  {
    id: "hargun_254004",
    name: "Hargun",
    email: "hargun.254004@sggscc.ac.in",
    department: "B.Sc. (Hons.) Computer Science",
    course: "B.Sc. (Hons.) Computer Science",
    semester: "III",
    group: "A",
    skills: ["C++", "SQL", "Data Structures", "OS Lab Support"],
    availabilityStatus: "Available (Group A)",
    isAvailable: true,
    activeTaskCount: 0,
    completedTaskCount: 15,
    performanceScore: 4.8,
    reliabilityScore: 96,
  },
];

export async function seedGroupATimetables() {
  try {
    const studentsRef = collection(db, "studentAssistants");
    for (const student of AUTHORIZED_INITIAL_STUDENTS) {
      // 1. Seed or update student profile in studentAssistants collection
      const studentDocRef = doc(db, "studentAssistants", student.id);
      await setDoc(
        studentDocRef,
        { ...student, updatedAt: new Date().toISOString() },
        { merge: true }
      ).catch(() => {});

      // 2. Seed structured timetable into timetables collection
      for (const [day, periods] of Object.entries(GROUP_A_TIMETABLE_ENTRIES)) {
        const timetableDocId = `${student.id}_${day}`;
        const timetableDocRef = doc(db, "timetables", timetableDocId);

        const structuredPeriods = periods.map((p) => {
          const timing = PERIOD_TIMINGS.find((t) => t.period === p.period);
          return {
            studentId: student.id,
            group: "A",
            day,
            period: p.period,
            startTime: timing.startTime,
            endTime: timing.endTime,
            subject: p.subject,
            isOccupied: p.isOccupied,
          };
        });

        await setDoc(
          timetableDocRef,
          {
            studentId: student.id,
            group: "A",
            day,
            entries: structuredPeriods,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch(() => {});
      }
    }
  } catch (err) {
    console.warn("Firestore timetable seeding fallback:", err);
  }
}
