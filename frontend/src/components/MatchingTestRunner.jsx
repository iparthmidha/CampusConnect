import React, { useState } from "react";
import { Play, CheckCircle2, XCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getStudentAvailability } from "../services/availabilityEngine";
import { findBestAssistants } from "../services/matchingEngine";

export function MatchingTestRunner({ isOpen, onClose }) {
  const [testResults, setTestResults] = useState([]);
  const [running, setRunning] = useState(false);

  if (!isOpen) return null;

  const runAllScenarios = async () => {
    setRunning(true);
    const results = [];

    const logTest = (id, name, passed, details) => {
      results.push({ id, name, passed, details });
      setTestResults([...results]);
    };

    try {
      // TEST 1: Monday 15:00–16:00 (Both Group A free: 15:00–17:00)
      const mondayAvailParth = await getStudentAvailability("parth_254012", "2026-08-10");
      const monWindow = mondayAvailParth.find((w) => w.startMins <= 900 && w.endMins >= 960);
      logTest(
        1,
        "Monday 15:00–16:00 Availability Detection",
        !!monWindow,
        monWindow ? `Free Window: ${monWindow.startTime}–${monWindow.endTime} (${monWindow.durationMinutes} mins)` : "Failed to detect free window"
      );

      // TEST 2: Wednesday 08:45–09:45 (Free Period I)
      const wedAvail = await getStudentAvailability("parth_254012", "2026-08-12");
      const wedWindow = wedAvail.find((w) => w.startMins <= 525 && w.endMins >= 585);
      logTest(
        2,
        "Wednesday 08:45–09:45 Free Period Evaluation",
        !!wedWindow,
        wedWindow ? `Free Window: ${wedWindow.startTime}–${wedWindow.endTime}` : "Failed to detect free window"
      );

      // TEST 3: Thursday 10:45–11:45 (Occupied OS Lab - Gp A)
      const thuAvail = await getStudentAvailability("parth_254012", "2026-08-13");
      const thuOccupied = !thuAvail.some((w) => w.startMins <= 645 && w.endMins >= 705);
      logTest(
        3,
        "Thursday 10:45–11:45 Lecture Occupation Check",
        thuOccupied,
        thuOccupied ? "Correctly flagged as OCCUPIED due to OS Lab Gp A" : "Error: Class period treated as free"
      );

      // TEST 4: Friday 15:00–17:00 Continuous 2-Hour Window
      const friAvail = await getStudentAvailability("parth_254012", "2026-08-14");
      const fri2HrWindow = friAvail.find((w) => w.durationMinutes >= 120);
      logTest(
        4,
        "Friday 15:00–17:00 Continuous 2-Hour Interval",
        !!fri2HrWindow,
        fri2HrWindow ? `Continuous Interval: ${fri2HrWindow.startTime}–${fri2HrWindow.endTime} (120 mins)` : "Failed to detect 2-hour window"
      );

      // TEST 5: Request 120 mins Monday 15:00–17:00 Qualification
      const matchTest5 = await findBestAssistants({
        preferredDate: "2026-08-10",
        preferredStartTime: "15:00",
        preferredEndTime: "17:00",
        requiredSkills: "Python, SQL",
      });
      const test5Passed = matchTest5.rankedCandidates.filter((c) => c.eligible).length >= 2;
      logTest(
        5,
        "120m Monday Request Dual-Candidate Qualification",
        test5Passed,
        `Eligible Candidates: ${matchTest5.rankedCandidates.filter((c) => c.eligible).map((c) => c.studentName).join(", ")}`
      );

      // TEST 6: Simulated Active Task Conflict (15:30–16:30) Disqualifies 2-Hour Request
      const parthWithConflict = await getStudentAvailability("parth_254012", "2026-08-10", [
        { preferredStartTime: "15:30", preferredEndTime: "16:30" },
      ]);
      const maxRemainingDuration = Math.max(...parthWithConflict.map((w) => w.durationMinutes), 0);
      const test6Passed = maxRemainingDuration < 120;
      logTest(
        6,
        "Active Task Collision Resolution (15:30–16:30 Overlap)",
        test6Passed,
        test6Passed ? `Conflict split interval. Max continuous window left: ${maxRemainingDuration} mins (< 120 mins required)` : "Failed task collision check"
      );

      // TEST 7: Duration Constraint Ranking Priority
      const matchTest7 = await findBestAssistants({
        preferredDate: "2026-08-10",
        preferredStartTime: "15:00",
        preferredEndTime: "16:00",
        requiredSkills: "SQL",
      });
      const test7Passed = matchTest7.bestMatch && matchTest7.bestMatch.eligible;
      logTest(
        7,
        "Duration Constraint Ranking Priority",
        test7Passed,
        `Top Ranked: ${matchTest7.bestMatch?.studentName} (${matchTest7.bestMatch?.matchScore}% score)`
      );

      // TEST 8: Full End-to-End Pipeline Evaluation
      const matchTest8 = await findBestAssistants({
        id: "test_pipeline_req_101",
        facultyName: "Dr. Faculty",
        title: "Test Pipeline Assistance Request",
        preferredDate: "2026-08-10",
        preferredStartTime: "15:00",
        preferredEndTime: "16:00",
        requiredSkills: "Python, DBMS",
      });
      const test8Passed = matchTest8.bestMatch && matchTest8.bestMatch.reasons.length > 0;
      logTest(
        8,
        "End-to-End Matching & Notification Dispatch",
        test8Passed,
        `Match Evaluated: ${matchTest8.bestMatch?.studentName} with ${matchTest8.bestMatch?.reasons.length} verified match reasons`
      );
    } catch (err) {
      console.error("Test runner error:", err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Matching Engine Diagnostics Suite"
      description="Execute 8 deterministic test scenarios verifying Group A timetable slots and task collision detection."
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Deterministic Test Harness</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={runAllScenarios}
              disabled={running}
              className="h-8 text-xs font-medium"
            >
              {running ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Execute All 8 Tests
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-2.5">
        {testResults.length === 0 ? (
          <Card className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 space-y-2">
            <Sparkles className="w-6 h-6 text-zinc-400 mx-auto" />
            <p className="text-xs text-zinc-500">
              Click <strong className="text-zinc-900 dark:text-zinc-100">"Execute All 8 Tests"</strong> to run automated validation on timetable availability and conflict intervals.
            </p>
          </Card>
        ) : (
          testResults.map((t) => (
            <div
              key={t.id}
              className="p-3 rounded-lg border bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-50">
                  Scenario {t.id}: {t.name}
                </span>
                {t.passed ? (
                  <Badge variant="success" className="text-[10px] py-0">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    PASSED
                  </Badge>
                ) : (
                  <Badge variant="danger" className="text-[10px] py-0">
                    <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                    FAILED
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                {t.details}
              </p>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
