import React from "react";
import { cn } from "../../lib/utils";

const STATUS_CONFIGS = {
  // Request / Task statuses
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dotClass: "bg-amber-500",
  },
  assigned: {
    label: "Assigned",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
    dotClass: "bg-sky-500",
  },
  accepted: {
    label: "Accepted",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    dotClass: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700",
    dotClass: "bg-zinc-400 dark:bg-zinc-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    dotClass: "bg-rose-500",
  },
  declined: {
    label: "Declined",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    dotClass: "bg-rose-500",
  },

  // Student real-time availability states
  free: {
    label: "Available",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    dotClass: "bg-emerald-500 animate-pulse",
  },
  busy: {
    label: "Busy / In Task",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    dotClass: "bg-rose-500",
  },
  in_class: {
    label: "In Lecture",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dotClass: "bg-amber-500",
  },
  "in-class": {
    label: "In Lecture",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dotClass: "bg-amber-500",
  },
};

export function StatusChip({ status, label: customLabel, className, showDot = true }) {
  const normalized = (status || "").toLowerCase().trim();
  const config = STATUS_CONFIGS[normalized] || {
    label: status || "Unknown",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    dotClass: "bg-zinc-400",
  };

  const displayText = customLabel || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-medium tracking-tight whitespace-nowrap",
        config.badgeClass,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClass)}
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
    </span>
  );
}
