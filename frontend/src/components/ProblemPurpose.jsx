import React from "react";
import { AlertCircle, CheckCircle, Clock3, MessageSquareOff, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function ProblemPurpose() {
  const painPoints = [
    {
      title: "Schedule Mismatches",
      description:
        "Faculty often spend valuable time trying to locate student assistants without knowing their current lecture or lab schedules.",
      icon: Clock3,
    },
    {
      title: "Manual Back-and-Forth",
      description:
        "Coordination over informal messaging channels leads to delayed responses, miscommunication, and untracked requests.",
      icon: MessageSquareOff,
    },
    {
      title: "Lack of Accountability",
      description:
        "Without a centralized system, tracking task completion, hour logs, and departmental requirements becomes cumbersome.",
      icon: HelpCircle,
    },
  ];

  return (
    <section id="problem" className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            The Institutional Challenge
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Bridging the Communication Gap in Faculty Assistance
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Colleges require a structured, conflict-free system to match faculty academic needs with available student assistants.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {painPoints.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 space-y-3 rounded-xl"
              >
                <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* The Campus Connect Solution Banner */}
        <div className="rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 p-8 sm:p-10 shadow-lg">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 dark:bg-zinc-200 text-xs font-semibold text-zinc-200 dark:text-zinc-800">
              <CheckCircle className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
              <span>The Campus Connect Solution</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Instant Alignment via Timetable Synchronization
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 dark:text-zinc-700 leading-relaxed">
              Campus Connect integrates directly with college schedules to intelligently match faculty task requests with qualified, currently available student assistants — eliminating scheduling conflicts automatically.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
