import React from "react";
import { FileText, UserCheck, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Request Assistance",
      description: "Faculty creates a task or describes what assistance is needed for practicals, grading, or departmental support.",
      icon: FileText,
    },
    {
      number: "02",
      title: "Smart Recommendation",
      description: "Campus Connect identifies suitable, currently available student assistants based on verified timetable slots.",
      icon: UserCheck,
    },
    {
      number: "03",
      title: "Get It Done",
      description: "The assigned student accepts the request and the faculty member can transparently track task progress.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Simple Academic Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            How Campus Connect Works
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Streamlining faculty requests and student assistant assignment in three transparent steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="bg-zinc-50/70 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 p-6 space-y-4 rounded-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-zinc-400 dark:text-zinc-600 tracking-tight">
                      {step.number}
                    </span>
                    <div className="h-11 w-11 rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
