import React from "react";
import { Clock, Calendar, ShieldCheck } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { GROUP_A_TIMETABLE_ENTRIES, PERIOD_TIMINGS } from "../services/timetableData";

export function StudentTimetable({ studentGroup = "A" }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="space-y-4">
      {/* Timetable Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
            Group {studentGroup} Institutional Timetable
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            B.Sc. (Hons.) Computer Science • Semester III • SGGSCC Official Schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
            Deterministic Engine Data
          </Badge>
        </div>
      </div>

      {/* Period Legend */}
      <div className="flex flex-wrap items-center gap-4 p-2.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 text-xs text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 font-medium text-[11px]">
          <div className="h-2.5 w-2.5 rounded-xs bg-zinc-900 dark:bg-zinc-100" />
          <span>Scheduled Lecture / Lab</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-[11px]">
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
          <span>Calculated Free Window</span>
        </div>
        <div className="ml-auto text-[11px] text-zinc-500 font-mono hidden sm:block">
          Recess: 12:45 PM – 1:00 PM (15 mins)
        </div>
      </div>

      {/* Weekly Schedule Rows */}
      <div className="space-y-3">
        {days.map((day) => {
          const daySchedule = GROUP_A_TIMETABLE_ENTRIES[day] || [];
          const freePeriods = daySchedule.filter((p) => !p.isOccupied);

          return (
            <Card
              key={day}
              className="p-3.5 sm:p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  {day}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 font-mono">
                  {freePeriods.length} Free Periods ({freePeriods.length * 60}m)
                </span>
              </div>

              {/* Grid of 8 Periods */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {daySchedule.map((entry) => {
                  const timing = PERIOD_TIMINGS.find((t) => t.period === entry.period);
                  return (
                    <div
                      key={entry.period}
                      className={`p-2 rounded-lg border text-xs flex flex-col justify-between transition-all min-h-[72px] ${
                        entry.isOccupied
                          ? "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100"
                          : "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] opacity-75 font-mono mb-1">
                        <span className="font-semibold">P{entry.period}</span>
                        <span>{timing?.startTime}</span>
                      </div>
                      <span
                        className="font-semibold truncate text-[11px] leading-tight"
                        title={entry.subject}
                      >
                        {entry.subject}
                      </span>
                      <span
                        className={`text-[9px] mt-1 font-semibold uppercase tracking-wider ${
                          entry.isOccupied ? "text-zinc-500" : "text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {entry.isOccupied ? "In Class" : "Available"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
