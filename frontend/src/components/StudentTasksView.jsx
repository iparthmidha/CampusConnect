import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Check,
  Loader2,
  PlayCircle,
  CheckCircle,
  FileText,
  Search,
  List,
  LayoutGrid,
  User,
  AlertCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { StatusChip } from "./ui/StatusChip";

export function StudentTasksView({
  pendingRequests = [],
  assignedTasks = [],
  onAccept,
  onDecline,
  onStart,
  onComplete,
  processingId,
}) {
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const acceptedTasks = assignedTasks.filter((t) => (t.status || "").toUpperCase() === "ACCEPTED");
  const inProgressTasks = assignedTasks.filter((t) => (t.status || "").toUpperCase() === "IN_PROGRESS");
  const completedTasks = assignedTasks.filter((t) => (t.status || "").toUpperCase() === "COMPLETED");

  const subTabs = [
    { id: "pending", label: "Pending Requests", count: pendingRequests.length },
    { id: "accepted", label: "Accepted", count: acceptedTasks.length },
    { id: "in_progress", label: "In Progress", count: inProgressTasks.length },
    { id: "completed", label: "Completed", count: completedTasks.length },
  ];

  const currentList =
    activeSubTab === "pending"
      ? pendingRequests
      : activeSubTab === "accepted"
      ? acceptedTasks
      : activeSubTab === "in_progress"
      ? inProgressTasks
      : completedTasks;

  const filteredTasks = currentList.filter((task) => {
    const q = searchTerm.toLowerCase();
    return (
      (task.title || "").toLowerCase().includes(q) ||
      (task.facultyName || "").toLowerCase().includes(q) ||
      (task.location || "").toLowerCase().includes(q) ||
      (task.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div>
          <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Assistance Task Ledger
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Accept pending requests, begin assigned tasks, and submit completions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              title="Card View"
              aria-label="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  activeSubTab === tab.id
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                    : "bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-100"
          />
        </div>
      </div>

      {/* Task Content: Table or Cards */}
      {filteredTasks.length === 0 ? (
        <Card className="p-10 text-center bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-2">
          <FileText className="h-7 w-7 text-zinc-300 dark:text-zinc-600 mx-auto" />
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {searchTerm
              ? "No tasks match your search filter."
              : `No tasks currently in the "${subTabs.find((t) => t.id === activeSubTab)?.label}" ledger.`}
          </p>
        </Card>
      ) : viewMode === "table" ? (
        /* DENSE TABLE VIEW */
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Task & Description</th>
                  <th className="py-2.5 px-4">Faculty Member</th>
                  <th className="py-2.5 px-4">Schedule & Venue</th>
                  <th className="py-2.5 px-4">Required Skills</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-800 dark:text-zinc-200">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusChip status={task.status || activeSubTab} />
                    </td>

                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="font-semibold text-zinc-950 dark:text-zinc-50">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xs mt-0.5">
                          {task.description}
                        </div>
                      )}
                      {task.priority && (
                        <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          Priority: {task.priority}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-zinc-950 dark:text-zinc-50 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-zinc-400" />
                        <span>{task.facultyName || "Faculty Member"}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-medium">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-mono">
                          {task.preferredStartTime || "15:00"} – {task.preferredEndTime || "17:00"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <span>{task.location || "SGGSCC Lab"}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {task.requiredSkills && task.requiredSkills.length > 0 ? (
                          task.requiredSkills.map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5">
                              {s}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-zinc-400 text-[11px]">Academic</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {activeSubTab === "pending" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="destructive"
                            size="xs"
                            disabled={processingId === task.id}
                            onClick={() => onDecline(task.id)}
                            className="h-7 text-xs"
                          >
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            size="xs"
                            disabled={processingId === task.id}
                            onClick={() => onAccept(task.id)}
                            className="h-7 text-xs"
                          >
                            {processingId === task.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Accept
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {activeSubTab === "accepted" && (
                        <Button
                          variant="primary"
                          size="xs"
                          disabled={processingId === task.id}
                          onClick={() => onStart(task.id)}
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        >
                          {processingId === task.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Starting...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Start Task
                            </>
                          )}
                        </Button>
                      )}

                      {activeSubTab === "in_progress" && (
                        <Button
                          variant="primary"
                          size="xs"
                          disabled={processingId === task.id}
                          onClick={() => onComplete(task.id)}
                          className="h-7 text-xs"
                        >
                          {processingId === task.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Completing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Completed
                            </>
                          )}
                        </Button>
                      )}

                      {activeSubTab === "completed" && (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusChip status={task.status || activeSubTab} />
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-400" />
                      {task.facultyName || "Faculty Member"}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {task.title}
                  </h3>
                </div>
                {task.priority && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                    {task.priority}
                  </span>
                )}
              </div>

              {task.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  <span>
                    {task.preferredStartTime || "15:00"} – {task.preferredEndTime || "17:00"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <MapPin className="h-3 w-3 text-zinc-400" />
                  <span>{task.location || "SGGSCC Lab"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/80">
                {activeSubTab === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      size="xs"
                      disabled={processingId === task.id}
                      onClick={() => onDecline(task.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      disabled={processingId === task.id}
                      onClick={() => onAccept(task.id)}
                    >
                      {processingId === task.id ? "Accepting..." : "Accept Request"}
                    </Button>
                  </>
                )}

                {activeSubTab === "accepted" && (
                  <Button
                    variant="primary"
                    size="xs"
                    disabled={processingId === task.id}
                    onClick={() => onStart(task.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                  >
                    {processingId === task.id ? "Starting..." : "Start Task"}
                  </Button>
                )}

                {activeSubTab === "in_progress" && (
                  <Button
                    variant="primary"
                    size="xs"
                    disabled={processingId === task.id}
                    onClick={() => onComplete(task.id)}
                  >
                    {processingId === task.id ? "Completing..." : "Mark Completed"}
                  </Button>
                )}

                {activeSubTab === "completed" && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Task Finished
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
