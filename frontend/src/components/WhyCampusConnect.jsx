import React from "react";
import { Award, ShieldCheck, Building2, Layers } from "lucide-react";
import { Card } from "./ui/card";

export function WhyCampusConnect() {
  const benefits = [
    {
      title: "Tailored for SGGSCC Departments",
      description:
        "Customized workflows built for Computer Science labs, Commerce practicals, Economics research, and administrative tasks.",
      icon: Building2,
    },
    {
      title: "Academic Attendance Protection",
      description:
        "Automatic timetable validation guarantees that students are never requested during their scheduled lectures or tutorials.",
      icon: ShieldCheck,
    },
    {
      title: "Equitable Workload Distribution",
      description:
        "Ensures student assistant opportunities and tasks are distributed fairly across eligible batches.",
      icon: Layers,
    },
    {
      title: "Institutional Accountability",
      description:
        "Maintains clear record keeping for faculty assistance hours, completed assignments, and department logs.",
      icon: Award,
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            College Identity & Value
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Why Campus Connect for SGGSCC?
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Purpose-built digital infrastructure empowering faculty productivity and student assistant development.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className="bg-zinc-50/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 p-6 space-y-3 rounded-xl flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {benefit.description}
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
