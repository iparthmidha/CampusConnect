import React from "react";
import {
  Clock,
  Sparkles,
  CalendarCheck,
  CheckSquare,
  Bell,
  Bot,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function CoreFeatures() {
  const features = [
    {
      title: "Real-Time Availability",
      description:
        "Instantly check which student assistants are free between lectures or lab slots.",
      icon: Clock,
      badge: "Availability",
    },
    {
      title: "Timetable Integration",
      description:
        "Direct alignment with SGGSCC academic schedules ensures zero class conflict.",
      icon: CalendarCheck,
      badge: "Schedule Sync",
    },
    {
      title: "Smart Assistant Matching",
      description:
        "Matches task demands with student skills, department, and available hours.",
      icon: Sparkles,
      badge: "Intelligent Alignment",
    },
    {
      title: "Task Management",
      description:
        "Create, assign, track, and verify completion of lab and exam assistance requests.",
      icon: CheckSquare,
      badge: "Progress Tracking",
    },
    {
      title: "Notifications",
      description:
        "Instant alerts notify students of assigned tasks and update faculty on progress.",
      icon: Bell,
      badge: "Instant Alerts",
    },
    {
      title: "Deterministic Scoring",
      description:
        "Mathematical weighted scoring evaluating duration fit, technical skills, and current workload.",
      icon: Sparkles,
      badge: "Scoring Engine",
    },
  ];

  return (
    <section id="features" className="py-20 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 shadow-2xs">
            Core Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Platform Capabilities
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Essential tools designed to simplify faculty delegation and student coordination.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 space-y-4 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="default" className="text-[11px]">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
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
