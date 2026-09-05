import React from "react";
import { Star, Sparkles, Clock, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function MatchesModal({ isOpen, onClose, matches, requestTitle }) {
  if (!isOpen || !matches || matches.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evaluated Candidate Matches"
      description={`Deterministic timetable & skill scoring for: ${requestTitle || "Assistance Request"}`}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>SGGSCC Deterministic Matching Engine</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {matches.map((candidate, idx) => (
          <Card
            key={candidate.studentId || idx}
            className={`p-4 border transition-all ${
              idx === 0 && candidate.eligible
                ? "bg-zinc-50/80 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700 shadow-2xs"
                : "bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {candidate.studentName
                    ? candidate.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : "ST"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                      {candidate.studentName}
                    </span>
                    {idx === 0 && candidate.eligible && (
                      <Badge variant="dark" className="text-[10px] py-0">
                        TOP RECOMMENDATION
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {candidate.department || "B.Sc. (H) CS • Group A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                {candidate.eligible ? (
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                      {candidate.matchScore}%
                    </span>
                    <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                      Match Score
                    </span>
                  </div>
                ) : (
                  <Badge variant="danger" className="text-xs">
                    Not Eligible
                  </Badge>
                )}
              </div>
            </div>

            {/* Timetable Availability Window */}
            <div className="pt-2.5 pb-1.5 flex flex-wrap items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>Calculated Free Window:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {candidate.availableStart} – {candidate.availableEnd} ({candidate.availableDuration} mins)
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-500 font-semibold font-mono">
                <Star className="h-3 w-3 fill-amber-400" />
                <span>{candidate.performanceScore} Rating</span>
              </div>
            </div>

            {/* Match Reasons */}
            <div className="space-y-1 pt-1">
              {candidate.reasons &&
                candidate.reasons.map((reason, rIdx) => (
                  <div
                    key={rIdx}
                    className={`text-xs flex items-center gap-1.5 ${
                      reason.startsWith("❌")
                        ? "text-rose-600 dark:text-rose-400 font-medium"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span>{reason}</span>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
