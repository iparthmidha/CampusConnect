import { GROUP_A_TIMETABLE_ENTRIES, PERIOD_TIMINGS } from "./timetableData";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  // Handle formats like "15:00", "08:45", "3:00 PM", "10:00 AM"
  const clean = timeStr.trim();
  const isPM = clean.toUpperCase().includes("PM");
  const isAM = clean.toUpperCase().includes("AM");
  
  let parts = clean.replace(/(AM|PM)/gi, "").trim().split(":");
  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1] || "0", 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hFormatted = h.toString().padStart(2, "0");
  const mFormatted = m.toString().padStart(2, "0");
  return `${hFormatted}:${mFormatted}`;
}

export function getDayOfWeekName(dateInput) {
  if (!dateInput) return "Monday";
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) return "Monday";
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dateObj.getDay()];
}

export async function getStudentAvailability(studentId, dateInput, activeTasks = []) {
  const dayName = getDayOfWeekName(dateInput);

  // 1. Load timetable for student and day
  let dayEntries = GROUP_A_TIMETABLE_ENTRIES[dayName] || [];

  try {
    const timetableDocRef = doc(db, "timetables", `${studentId}_${dayName}`);
    const snap = await getDoc(timetableDocRef);
    if (snap.exists() && snap.data().entries) {
      dayEntries = snap.data().entries;
    }
  } catch (err) {
    console.warn("Using fallback local Group A timetable:", err);
  }

  // 2. Identify unoccupied periods and merge into continuous free time intervals
  const freePeriods = [];
  dayEntries.forEach((entry) => {
    if (!entry.isOccupied) {
      const timing = PERIOD_TIMINGS.find((t) => t.period === entry.period);
      if (timing) {
        freePeriods.push({
          startMins: timeToMinutes(timing.startTime),
          endMins: timeToMinutes(timing.endTime),
        });
      }
    }
  });

  // Merge adjacent periods (e.g. 15:00-16:00 and 16:00-17:00 => 15:00-17:00)
  let mergedIntervals = [];
  if (freePeriods.length > 0) {
    freePeriods.sort((a, b) => a.startMins - b.startMins);
    let current = { ...freePeriods[0] };

    for (let i = 1; i < freePeriods.length; i++) {
      const next = freePeriods[i];
      if (next.startMins <= current.endMins + 15) { // Handle 15-min gap if contiguous
        current.endMins = Math.max(current.endMins, next.endMins);
      } else {
        mergedIntervals.push(current);
        current = { ...next };
      }
    }
    mergedIntervals.push(current);
  }

  // 3. Subtract active task collisions from available intervals
  let finalAvailableIntervals = [...mergedIntervals];

  if (activeTasks && activeTasks.length > 0) {
    activeTasks.forEach((task) => {
      if (!task.preferredStartTime || !task.preferredEndTime) return;
      const taskStart = timeToMinutes(task.preferredStartTime);
      const taskEnd = timeToMinutes(task.preferredEndTime);

      let nextIntervals = [];
      finalAvailableIntervals.forEach((interval) => {
        // Case A: Task is outside interval
        if (taskEnd <= interval.startMins || taskStart >= interval.endMins) {
          nextIntervals.push(interval);
        } else {
          // Task overlaps interval -> Split interval around task
          if (taskStart > interval.startMins) {
            nextIntervals.push({
              startMins: interval.startMins,
              endMins: taskStart,
            });
          }
          if (taskEnd < interval.endMins) {
            nextIntervals.push({
              startMins: taskEnd,
              endMins: interval.endMins,
            });
          }
        }
      });
      finalAvailableIntervals = nextIntervals;
    });
  }

  // Format into final structure with formatted time strings & duration
  return finalAvailableIntervals.map((inv) => ({
    startMins: inv.startMins,
    endMins: inv.endMins,
    startTime: minutesToTime(inv.startMins),
    endTime: minutesToTime(inv.endMins),
    durationMinutes: inv.endMins - inv.startMins,
  }));
}
