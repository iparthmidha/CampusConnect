import React, { useState, useEffect } from "react";
import {
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  Sparkles,
  Calendar,
  MapPin,
  Star,
  Eye,
  Loader2,
  Play,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Modal } from "../components/ui/Modal";
import { Input, Textarea, Select, Label } from "../components/ui/Input";
import { StatusChip } from "../components/ui/StatusChip";
import { StudentModal } from "../components/StudentModal";
import { MatchesModal } from "../components/MatchesModal";
import { MatchingTestRunner } from "../components/MatchingTestRunner";
import { FacultyRequestsTable } from "../components/faculty/FacultyRequestsTable";
import { FacultyLayout } from "../layouts/FacultyLayout";
import { useAuth } from "../context/AuthContext";
import {
  createAssistanceRequest,
  subscribeFacultyRequests,
  subscribeAvailableStudents,
} from "../services/firebase";
import { findBestAssistants } from "../services/matchingEngine";

export function FacultyDashboard({ navigate }) {
  const { userProfile, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'requests' | 'assistants'
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);

  const [requestsLoading, setRequestsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Latest Matching Recommendation State
  const [latestMatchResult, setLatestMatchResult] = useState(null);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [preferredStartTime, setPreferredStartTime] = useState("15:00");
  const [preferredEndTime, setPreferredEndTime] = useState("17:00");
  const [duration, setDuration] = useState("2 Hours");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("SGGSCC Computer Lab 3");
  const [notes, setNotes] = useState("");

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (userProfile?.uid) {
      setRequestsLoading(true);
      const unsubRequests = subscribeFacultyRequests(userProfile.uid, (data) => {
        setRequests(data);
        setRequestsLoading(false);
      });
      return () => unsubRequests();
    }
  }, [userProfile?.uid]);

  useEffect(() => {
    setStudentsLoading(true);
    const unsubStudents = subscribeAvailableStudents((data) => {
      setStudents(data);
      setStudentsLoading(false);
    });
    return () => unsubStudents();
  }, []);

  // Compute Statistics
  const pendingCount = requests.filter((r) => (r.status || "").toUpperCase() === "PENDING").length;
  const activeCount = requests.filter(
    (r) => (r.status || "").toUpperCase() === "ACCEPTED" || (r.status || "").toUpperCase() === "IN_PROGRESS"
  ).length;
  const completedCount = requests.filter((r) => (r.status || "").toUpperCase() === "COMPLETED").length;
  const availableAssistantsCount = students.filter(
    (s) => s.availabilityStatus === "FREE" || !s.availabilityStatus || s.availabilityStatus === "Group A Free"
  ).length;

  // Handle Form Submit
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError("Please fill out task title and description.");
      return;
    }

    setSubmittingRequest(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const skillsArray = requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const requestPayload = {
        title,
        description,
        requiredSkills: skillsArray,
        preferredStartTime,
        preferredEndTime,
        duration,
        priority,
        location,
        notes,
        preferredDate: new Date().toISOString().split("T")[0],
      };

      const newRequestId = await createAssistanceRequest(userProfile, requestPayload);

      // Run Deterministic Matching Engine
      const matchOutcome = await findBestAssistants({
        ...requestPayload,
        id: newRequestId,
        facultyName: userProfile?.name || "Faculty Member",
        facultyDepartment: userProfile?.department || "Dept. of Computer Science",
      });

      setLatestMatchResult({
        ...matchOutcome,
        requestTitle: title,
        requestId: newRequestId,
      });

      setFormSuccess(true);
      setTitle("");
      setDescription("");
      setRequiredSkills("");
      setNotes("");

      setTimeout(() => {
        setFormSuccess(false);
        setIsRequestModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error("Failed to submit request:", err);
      setFormError("Failed to create assistance request. Please try again.");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleRequestStudentSpecific = (student) => {
    setTitle(`Lab Assistance & Grading — ${student.name.split(" ")[0]}`);
    setRequiredSkills(student.skills ? student.skills.join(", ") : "");
    setIsRequestModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-400">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-900 dark:text-zinc-100 mb-3" />
        <p className="text-xs font-medium">Verifying SGGSCC credentials...</p>
      </div>
    );
  }

  return (
    <FacultyLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenRequestModal={() => setIsRequestModalOpen(true)}
      navigate={navigate}
    >
      {/* OVERVIEW STATISTICS LEDGER */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Pending Requests
            </span>
            <div className="h-7 w-7 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
              {requestsLoading ? "..." : pendingCount}
            </span>
            <span className="text-[11px] text-zinc-500">Awaiting match</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Active Tasks
            </span>
            <div className="h-7 w-7 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-900/40 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
              {requestsLoading ? "..." : activeCount}
            </span>
            <span className="text-[11px] text-zinc-500">In progress</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Completed
            </span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
              {requestsLoading ? "..." : completedCount}
            </span>
            <span className="text-[11px] text-zinc-500">Archived</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Available Pool
            </span>
            <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950 dark:text-zinc-50 tracking-tight">
              {studentsLoading ? "..." : availableAssistantsCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Group A Ready
            </span>
          </div>
        </Card>
      </div>

      {/* INSTITUTIONAL MATCH EVALUATION BANNER (If latest match evaluated) */}
      {latestMatchResult && latestMatchResult.bestMatch && (
        <Card className="p-5 bg-zinc-50 dark:bg-zinc-900/70 border-zinc-300 dark:border-zinc-700 space-y-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Recommended Assistant Match
                  </span>
                  <Badge variant="success" className="text-[10px] py-0">
                    Engine Evaluated
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                  {latestMatchResult.bestMatch.studentName}
                  <span className="text-xs font-normal text-zinc-500 ml-1.5">
                    ({latestMatchResult.bestMatch.department || "B.Sc. Hons CS"})
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                  {latestMatchResult.bestMatch.matchScore}%
                </span>
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  Match Score
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsMatchesModalOpen(true)}
              >
                View All Matches ({latestMatchResult.rankedCandidates?.length || 0})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="space-y-1">
              <span className="font-semibold text-zinc-950 dark:text-zinc-100 block text-[11px] uppercase tracking-wider">
                Timetable Free Slot:
              </span>
              <span className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-200">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                {latestMatchResult.bestMatch.availableStart} – {latestMatchResult.bestMatch.availableEnd} ({latestMatchResult.bestMatch.availableDuration} mins free)
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-zinc-950 dark:text-zinc-100 block text-[11px] uppercase tracking-wider">
                Deterministic Match Reasons:
              </span>
              <div className="space-y-0.5">
                {latestMatchResult.bestMatch.reasons &&
                  latestMatchResult.bestMatch.reasons.slice(0, 2).map((r, i) => (
                    <span key={i} className="block text-[11px] text-zinc-600 dark:text-zinc-300">
                      {r}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ASSISTANCE REQUESTS SECTION */}
      {(activeTab === "dashboard" || activeTab === "requests") && (
        <section className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Assistance Requests Ledger
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage requests for lab practicals, assessment grading, and academic invigilation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsTestRunnerOpen(true)}
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                Engine Diagnostics
              </Button>
            </div>
          </div>

          <FacultyRequestsTable
            requests={requests}
            loading={requestsLoading}
            onNewRequest={() => setIsRequestModalOpen(true)}
            onViewMatches={(req) => {
              if (latestMatchResult) {
                setIsMatchesModalOpen(true);
              } else {
                handleRequestStudentSpecific({ name: req.assignedStudentName || "Candidate" });
              }
            }}
          />
        </section>
      )}

      {/* AVAILABLE STUDENT ASSISTANTS SECTION */}
      {(activeTab === "dashboard" || activeTab === "assistants") && (
        <section className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Student Assistants Roster
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Verified B.Sc. (H) Computer Science • Semester III (Group A)
              </p>
            </div>
          </div>

          {studentsLoading ? (
            <Card className="p-8 text-center bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mb-2" />
              <p className="text-xs text-zinc-500">Loading student profiles...</p>
            </Card>
          ) : students.length === 0 ? (
            <Card className="p-8 text-center bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">No student assistants registered in the system yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="p-4 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0">
                          {student.name ? student.name.split(" ").map((n) => n[0]).join("") : "ST"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                              {student.name}
                            </span>
                            <div className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold font-mono">
                              <Star className="h-3 w-3 fill-amber-400" />
                              <span>{student.performanceScore || 4.9}</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                            {student.department || "B.Sc. (H) CS • Group A"}
                          </span>
                        </div>
                      </div>

                      <StatusChip status={student.availabilityStatus === "BUSY" ? "busy" : "free"} />
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                      <div className="flex justify-between text-zinc-500">
                        <span>Timetable Free Slot:</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                          {student.timetableSlot || "15:00 – 17:00"}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>Active Concurrent Tasks:</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                          {student.activeTaskCount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {student.skills &&
                        student.skills.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px] py-0 px-1.5">
                            {s}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-xs"
                      onClick={() => handleViewStudentProfile(student)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Dossier
                    </Button>

                    <Button
                      variant="primary"
                      size="xs"
                      className="text-xs"
                      onClick={() => handleRequestStudentSpecific(student)}
                    >
                      Request Assistance
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CREATE REQUEST MODAL PRIMITIVE */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Create Assistance Request"
        description="Enter task specifications to evaluate timetable availability and compute the best assistant match."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          {formSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Assistance request created & matching engine executed successfully.</span>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <Label required>Task Title</Label>
            <Input
              type="text"
              placeholder="e.g. DBMS Practical Lab Verification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label required>Description & Responsibilities</Label>
            <Textarea
              rows={3}
              placeholder="Detail the academic tasks, software requirements, or grading criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Required Skills</Label>
              <Input
                type="text"
                placeholder="Python, SQL, Linux"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
              />
            </div>

            <div>
              <Label>Priority Level</Label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={preferredStartTime}
                onChange={(e) => setPreferredStartTime(e.target.value)}
              />
            </div>

            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={preferredEndTime}
                onChange={(e) => setPreferredEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Venue / Lab Location</Label>
            <Input
              type="text"
              placeholder="e.g. SGGSCC Computer Lab 3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submittingRequest}
            >
              {submittingRequest ? "Evaluating..." : "Create & Find Match"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* STUDENT PROFILE MODAL */}
      <StudentModal
        student={selectedStudent}
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onRequestAssign={(st) => handleRequestStudentSpecific(st)}
      />

      {/* MATCHES EVALUATION MODAL */}
      <MatchesModal
        isOpen={isMatchesModalOpen}
        onClose={() => setIsMatchesModalOpen(false)}
        matches={latestMatchResult?.rankedCandidates}
        requestTitle={latestMatchResult?.requestTitle}
      />

      {/* MATCHING ENGINE TEST SUITE RUNNER */}
      <MatchingTestRunner
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />
    </FacultyLayout>
  );
}
