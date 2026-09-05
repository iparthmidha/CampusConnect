import React, { useState } from "react";
import {
  FileText,
  Clock,
  MapPin,
  Search,
  Filter,
  Users,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { StatusChip } from "../ui/StatusChip";

export function FacultyRequestsTable({
  requests = [],
  loading = false,
  onNewRequest,
  onViewMatches,
  onViewStudent,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  // Filter requests
  const filtered = requests.filter((req) => {
    const matchesSearch =
      (req.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.requiredSkills || []).some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (!matchesSearch) return false;
    if (statusFilter === "ALL") return true;
    return (req.status || "").toUpperCase() === statusFilter;
  });

  return (
    <div className="space-y-3.5">
      {/* Table Controls: Filter, Search, View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, skills, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-100"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              title="Dense Table View"
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

          <Button
            variant="primary"
            size="sm"
            onClick={onNewRequest}
            className="h-8 text-xs font-medium"
          >
            New Request
          </Button>
        </div>
      </div>

      {/* Requests Content */}
      {loading ? (
        <Card className="p-10 text-center bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mb-2" />
          <p className="text-xs text-zinc-500">Loading assistance requests...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <FileText className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {searchTerm || statusFilter !== "ALL"
                ? "No matching requests found"
                : "No assistance requests recorded"}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "ALL"
                ? "Try adjusting your search query or filter."
                : "Create your first assistance request to coordinate lab invigilation, grading, or academic tasks."}
            </p>
          </div>
          {!searchTerm && statusFilter === "ALL" && (
            <div className="pt-1">
              <Button variant="primary" size="sm" onClick={onNewRequest}>
                Create Assistance Request
              </Button>
            </div>
          )}
        </Card>
      ) : viewMode === "table" ? (
        /* DENSE INSTITUTIONAL DATA TABLE */
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Request / Task</th>
                  <th className="py-2.5 px-4">Schedule & Venue</th>
                  <th className="py-2.5 px-4">Skills Required</th>
                  <th className="py-2.5 px-4">Assigned Assistant</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-800 dark:text-zinc-200">
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Status Column */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusChip status={req.status || "PENDING"} />
                    </td>

                    {/* Title & Priority Column */}
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="font-semibold text-zinc-950 dark:text-zinc-50 truncate max-w-xs">
                        {req.title}
                      </div>
                      {req.description && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 max-w-xs mt-0.5">
                          {req.description}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] uppercase font-semibold text-zinc-400">
                          Priority:
                        </span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                            req.priority === "Urgent"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              : req.priority === "High"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {req.priority || "Medium"}
                        </span>
                      </div>
                    </td>

                    {/* Schedule & Venue Column */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-medium">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>
                          {req.preferredStartTime || "15:00"} – {req.preferredEndTime || "17:00"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <span className="truncate max-w-[140px]">
                          {req.location || "SGGSCC Lab"}
                        </span>
                      </div>
                    </td>

                    {/* Skills Column */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {req.requiredSkills && req.requiredSkills.length > 0 ? (
                          req.requiredSkills.map((s) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="text-[10px] py-0 px-1.5"
                            >
                              {s}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-zinc-400 text-[11px]">Academic</span>
                        )}
                      </div>
                    </td>

                    {/* Assigned Student Column */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.assignedStudentName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[10px] font-bold flex items-center justify-center">
                            {req.assignedStudentName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-950 dark:text-zinc-50 text-xs">
                              {req.assignedStudentName}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {req.assignedStudentEmail || "Student Assistant"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          Pending Assignment
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {onViewMatches && (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => onViewMatches(req)}
                          className="text-xs"
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-zinc-500" />
                          View Matches
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* REFINED CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((req) => (
            <Card
              key={req.id}
              className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusChip status={req.status || "PENDING"} />
                    <span className="text-[10px] text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {req.preferredStartTime || "15:00"} – {req.preferredEndTime || "17:00"}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {req.title}
                  </h4>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                  {req.priority || "Medium"}
                </span>
              </div>

              {req.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex flex-wrap gap-1">
                  {req.requiredSkills && req.requiredSkills.length > 0 ? (
                    req.requiredSkills.map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-zinc-400 text-[10px]">Academic</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{req.location || "SGGSCC Lab"}</span>
                </div>
              </div>

              {onViewMatches && (
                <div className="pt-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onViewMatches(req)}
                    className="w-full justify-center text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-zinc-500" />
                    Review Assistant Matches
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
