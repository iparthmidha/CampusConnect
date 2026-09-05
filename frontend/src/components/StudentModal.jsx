import React from "react";
import { Star, Clock, ShieldCheck, User } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StatusChip } from "./ui/StatusChip";

export function StudentModal({ student, isOpen, onClose, onRequestAssign }) {
  if (!isOpen || !student) return null;

  const initials = student.name
    ? student.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assistant Profile Dossier"
      description="Official student assistant credentials and timetable availability."
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>SGGSCC Verified Student</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
            {onRequestAssign && (
              <Button
                variant="primary"
                size="sm"
                className="h-8 text-xs font-medium"
                onClick={() => {
                  onClose();
                  onRequestAssign(student);
                }}
              >
                Request Assistance
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Header: Student Avatar & Info */}
        <div className="flex items-start gap-3.5">
          <div className="h-12 w-12 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-base flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {student.name}
              </h3>
              <Badge variant="success" className="text-[10px] py-0">
                Verified
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {student.department || "B.Sc. (Hons.) Computer Science • Group A"}
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold pt-0.5 font-mono">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>{student.performanceScore || 5.0} Rating</span>
              <span className="text-zinc-400 font-normal">•</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-normal font-sans">
                {student.completedTaskCount || 0} Tasks Completed
              </span>
            </div>
          </div>
        </div>

        {/* Status & Workload */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-semibold block mb-1">
              Live Status
            </span>
            <StatusChip
              status={
                student.availabilityStatus === "BUSY" ? "busy" : "free"
              }
            />
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-semibold block mb-1">
              Current Workload
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
              {student.activeTaskCount || 0} Active Task{student.activeTaskCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Timetable Window */}
        <div className="space-y-1.5">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Timetable Slot Availability
          </span>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300">
            <Clock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="font-mono">{student.timetableSlot || "15:00 – 17:00 (Free Window)"}</span>
          </div>
        </div>

        {/* Verified Technical Skills */}
        <div className="space-y-1.5">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Verified Skills
          </span>
          <div className="flex flex-wrap gap-1">
            {student.skills && student.skills.length > 0 ? (
              student.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs py-0.5">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-zinc-500">General Academic Support</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
