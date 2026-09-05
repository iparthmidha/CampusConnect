import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Calendar,
  MapPin,
  Star,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  ShieldCheck,
  User,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { StatusChip } from "../components/ui/StatusChip";
import { StudentLayout } from "../layouts/StudentLayout";
import { StudentTimetable } from "../components/StudentTimetable";
import { StudentTasksView } from "../components/StudentTasksView";
import { useAuth } from "../context/AuthContext";
import {
  updateStudentAvailability,
  acceptAssistanceRequest,
  declineAssistanceRequest,
  startAssistanceTask,
  completeAssistanceTask,
  subscribeStudentTasks,
  subscribeStudentPendingRequests,
} from "../services/firebase";
import { getStudentAvailability, getDayOfWeekName } from "../services/availabilityEngine";
import { GROUP_A_TIMETABLE_ENTRIES, PERIOD_TIMINGS } from "../services/timetableData";

export function StudentDashboard({ navigate, currentPath }) {
  const { userProfile, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState(() => {
    if (currentPath?.startsWith("/student/")) {
      return currentPath.split("/")[2] || "dashboard";
    }
    return "dashboard";
  });

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Availability state
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState("FREE");
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [todayFreeWindows, setTodayFreeWindows] = useState([]);

  // Action status messages
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");
  const [actionErrorMsg, setActionErrorMsg] = useState("");
  const [processingRequestId, setProcessingRequestId] = useState(null);

  // Sync route param with activeTab
  useEffect(() => {
    if (currentPath?.startsWith("/student/")) {
      const tab = currentPath.split("/")[2];
      if (tab) setActiveTab(tab);
    } else if (currentPath === "/student-dashboard") {
      setActiveTab("dashboard");
    }
  }, [currentPath]);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (userProfile?.uid) {
      setTasksLoading(true);
      const unsubTasks = subscribeStudentTasks(userProfile.uid, (tasks) => {
        setAssignedTasks(tasks);
        setTasksLoading(false);
      });

      setRequestsLoading(true);
      const unsubRequests = subscribeStudentPendingRequests(userProfile.uid, (requests) => {
        setPendingRequests(requests);
        setRequestsLoading(false);
      });

      return () => {
        unsubTasks();
        unsubRequests();
      };
    }
  }, [userProfile?.uid]);

  // Compute Today's Free Windows
  useEffect(() => {
    async function fetchFreeWindows() {
      if (!userProfile?.uid) return;
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const studentId = userProfile.uid.toLowerCase().includes("parth")
          ? "parth_254012"
          : "hargun_254004";
        const windows = await getStudentAvailability(studentId, todayStr, assignedTasks);
        setTodayFreeWindows(windows);
      } catch (err) {
        console.error("Failed to calculate free windows:", err);
      }
    }
    fetchFreeWindows();
  }, [userProfile?.uid, assignedTasks]);

  // Set initial status from profile
  useEffect(() => {
    if (userProfile?.availabilityStatus) {
      setAvailabilityStatus(userProfile.availabilityStatus);
      setIsAvailable(userProfile.availabilityStatus === "FREE");
    }
  }, [userProfile]);

  // Toggle Live Availability
  const handleToggleAvailability = async () => {
    if (!userProfile?.uid) return;
    setTogglingAvailability(true);
    const newStatus = isAvailable ? "BUSY" : "FREE";
    try {
      await updateStudentAvailability(userProfile.uid, newStatus);
      setIsAvailable(!isAvailable);
      setAvailabilityStatus(newStatus);
      setActionSuccessMsg(`Status updated: ${newStatus === "FREE" ? "Available" : "Busy"}`);
      setTimeout(() => setActionSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
      setActionErrorMsg("Failed to update availability status.");
    } finally {
      setTogglingAvailability(false);
    }
  };

  // Accept Request
  const handleAcceptRequest = async (requestId) => {
    setProcessingRequestId(requestId);
    setActionSuccessMsg("");
    setActionErrorMsg("");

    try {
      await acceptAssistanceRequest(requestId, userProfile);
      setActionSuccessMsg("Assistance request accepted and added to your tasks.");
      setTimeout(() => setActionSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Accept error:", err);
      setActionErrorMsg(err.message || "Failed to accept request.");
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Decline Request
  const handleDeclineRequest = async (requestId) => {
    setProcessingRequestId(requestId);
    setActionSuccessMsg("");
    setActionErrorMsg("");

    try {
      await declineAssistanceRequest(requestId, userProfile);
      setActionSuccessMsg("Request declined.");
      setTimeout(() => setActionSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Decline error:", err);
      setActionErrorMsg(err.message || "Failed to decline request.");
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Start Task
  const handleStartTask = async (taskId) => {
    setProcessingRequestId(taskId);
    setActionSuccessMsg("");
    setActionErrorMsg("");

    try {
      await startAssistanceTask(taskId, userProfile);
      setActionSuccessMsg("Task status updated to In Progress.");
      setTimeout(() => setActionSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Start task error:", err);
      setActionErrorMsg(err.message || "Failed to start task.");
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Complete Task
  const handleCompleteTask = async (taskId) => {
    setProcessingRequestId(taskId);
    setActionSuccessMsg("");
    setActionErrorMsg("");

    try {
      await completeAssistanceTask(taskId, userProfile);
      setActionSuccessMsg("Task marked as completed.");
      setTimeout(() => setActionSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Complete task error:", err);
      setActionErrorMsg(err.message || "Failed to complete task.");
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Derive Current Active Task
  const currentActiveTask = assignedTasks.find(
    (t) => t.status === "ACCEPTED" || t.status === "IN_PROGRESS"
  );

  // Calculate Next Class from Timetable
  const dayName = getDayOfWeekName(new Date());
  const daySchedule = GROUP_A_TIMETABLE_ENTRIES[dayName] || GROUP_A_TIMETABLE_ENTRIES["Monday"];
  const nextClass = daySchedule.find((p) => p.isOccupied) || { subject: "No further classes today", period: 8 };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-400">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-900 dark:text-zinc-100 mb-3" />
        <p className="text-xs font-medium">Verifying SGGSCC student authorization...</p>
      </div>
    );
  }

  return (
    <StudentLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      navigate={navigate}
    >
      <div className="space-y-6">
        {/* Alerts */}
        {actionSuccessMsg && (
          <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {actionErrorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{actionErrorMsg}</span>
          </div>
        )}

        {/* COMMAND CENTER METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Availability Status Card with Live Toggle */}
          <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Live Availability
              </span>
              <StatusChip status={isAvailable ? "free" : "busy"} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                  {isAvailable ? "Available" : "Busy"}
                </span>
                <span className="text-[10px] text-zinc-500 block">
                  {isAvailable ? "Open for tasks" : "Currently occupied"}
                </span>
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                className="text-xs h-7"
              >
                {isAvailable ? (
                  <>
                    <ToggleRight className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                    Set Busy
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-3.5 w-3.5 text-zinc-400 mr-1" />
                    Set Free
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Current Active Task Card */}
          <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Current Active Task
              </span>
              <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2">
              {currentActiveTask ? (
                <div>
                  <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 block truncate">
                    {currentActiveTask.title}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
                    {currentActiveTask.preferredStartTime} – {currentActiveTask.preferredEndTime}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-base font-bold text-zinc-400 block">None Active</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Ready for requests</span>
                </div>
              )}
            </div>
          </Card>

          {/* Next Scheduled Class Card */}
          <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Next Timetable Class
              </span>
              <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 block truncate">
                {nextClass.subject}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono block mt-0.5">
                Group A • Period {nextClass.period}
              </span>
            </div>
          </Card>

          {/* Performance Score Card */}
          <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Performance Rating
              </span>
              <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                {userProfile?.performanceScore || "4.9"}
              </span>
              <span className="text-[11px] text-zinc-500">/ 5.0 rating score</span>
            </div>
          </Card>
        </div>

        {/* DASHBOARD TAB: INCOMING REQUESTS & QUICK OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-5">
            {/* Incoming Requests Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
                <div>
                  <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                    Incoming Faculty Requests ({pendingRequests.length})
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Faculty requests awaiting your confirmation.
                  </p>
                </div>
              </div>

              {pendingRequests.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-2">
                  <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto" />
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    No pending assistance requests
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    All incoming assignments have been processed. New faculty requests will appear here in real time.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {pendingRequests.map((req) => (
                    <Card
                      key={req.id}
                      className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StatusChip status="pending" />
                            <span className="text-[10px] text-zinc-400">•</span>
                            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                              <User className="w-3 h-3 text-zinc-400" />
                              {req.facultyName || "Faculty"}
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

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {req.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          <span>
                            {req.preferredStartTime || "15:00"} – {req.preferredEndTime || "17:00"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="h-3 w-3 text-zinc-400" />
                          <span>{req.location || "SGGSCC Lab"}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800/80">
                        <Button
                          variant="destructive"
                          size="xs"
                          disabled={processingRequestId === req.id}
                          onClick={() => handleDeclineRequest(req.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="xs"
                          disabled={processingRequestId === req.id}
                          onClick={() => handleAcceptRequest(req.id)}
                        >
                          {processingRequestId === req.id ? "Accepting..." : "Accept Request"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Quick Link to Timetable */}
            <Card className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    Group A Timetable Schedule
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Review your academic classes, labs, and calculated free windows for assistance matching.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 shrink-0"
                onClick={() => {
                  setActiveTab("timetable");
                  navigate?.("/student/timetable");
                }}
              >
                View Full Timetable
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Card>
          </div>
        )}

        {/* TIMETABLE TAB */}
        {activeTab === "timetable" && (
          <StudentTimetable studentGroup={userProfile?.group || "A"} />
        )}

        {/* MY TASKS TAB */}
        {activeTab === "tasks" && (
          <StudentTasksView
            pendingRequests={pendingRequests}
            assignedTasks={assignedTasks}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onStart={handleStartTask}
            onComplete={handleCompleteTask}
            processingId={processingRequestId}
          />
        )}

        {/* AVAILABILITY TAB */}
        {activeTab === "availability" && (
          <div className="space-y-4">
            <div className="pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Calculated Free Windows — Group A
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Calculated automatically by the deterministic timetable engine after deducting scheduled classes and active tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {todayFreeWindows.map((win, idx) => (
                <Card
                  key={idx}
                  className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-500 uppercase text-[10px] tracking-wider">
                      Free Window #{idx + 1}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-mono text-[11px]">
                      {win.durationMinutes} mins free
                    </span>
                  </div>
                  <span className="text-lg font-bold font-mono block text-zinc-900 dark:text-zinc-100">
                    {win.startTime} – {win.endTime}
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Available for faculty assistance requests and lab invigilation.
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE / DOSSIER TAB */}
        {activeTab === "profile" && (
          <Card className="p-6 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-5 max-w-2xl">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="h-12 w-12 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-base flex items-center justify-center">
                {userProfile?.name
                  ? userProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "ST"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                    {userProfile?.name}
                  </h3>
                  <Badge variant="success" className="text-[10px]">
                    Verified Assistant
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  {userProfile?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  Academic Programme
                </span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {userProfile?.course || "B.Sc. (Hons.) Computer Science"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  Semester & Cohort
                </span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Semester III • Group A
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  College
                </span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Sri Guru Gobind Singh College of Commerce
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  Performance Evaluation
                </span>
                <p className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {userProfile?.performanceScore || "4.9 / 5.0"}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                Verified Technical Proficiencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(userProfile?.skills || ["Python", "C++", "DBMS", "SQL", "Linux", "Data Structures"]).map(
                  (skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SGGSCC Institutional Assistant Dossier • Protected under college academic policy</span>
            </div>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}
