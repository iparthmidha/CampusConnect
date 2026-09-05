import React from "react";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";

export function FinalCTA({ navigate }) {
  return (
    <section className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md bg-zinc-800 dark:bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-200 dark:text-zinc-800">
              <GraduationCap className="h-4 w-4" />
              <span>Sri Guru Gobind Singh College of Commerce</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white dark:text-zinc-950 leading-tight">
              Make Faculty Assistance Smarter
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 dark:text-zinc-700 max-w-xl mx-auto">
              Find the right student assistant at the right time.
            </p>

            <div className="pt-4 flex justify-center">
              <Button
                variant="primary"
                size="lg"
                className="px-8 py-3 text-base bg-white text-zinc-950 hover:bg-zinc-200 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800 border-none cursor-pointer"
                onClick={() => navigate && navigate("/login")}
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
