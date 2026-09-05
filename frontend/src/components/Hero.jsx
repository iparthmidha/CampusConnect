import React from "react";
import { ArrowRight, ShieldCheck, Calendar, Users, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function Hero({ navigate }) {
  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Institutional Badge */}
            <div className="inline-flex items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
              <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
              <span>Sri Guru Gobind Singh College of Commerce</span>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">Digital Infrastructure</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.15]">
              Connecting Faculty with the{" "}
              <span className="underline decoration-zinc-400 dark:decoration-zinc-600 decoration-2 underline-offset-6">
                Right Assistance
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed max-w-2xl">
              Campus Connect helps faculty find, assign and track student assistance based on real-time availability, schedules and intelligent recommendations.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button variant="primary" size="lg" className="px-7 cursor-pointer" onClick={() => navigate && navigate("/login")}>
                Get Started
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>

              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </a>
            </div>

            {/* Trust Markers */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                <span>Real-Time Availability</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                <span>Timetable Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                <span>SGGSCC Institutional SSO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Institutional Infographic Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Card className="w-full max-w-md p-6 bg-zinc-50 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 shadow-lg space-y-6">
              
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                    SG
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                      SGGSCC Academic Operations
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Centralized Delegation Overview
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="text-[10px]">
                  Institutional System
                </Badge>
              </div>

              {/* Key Infrastructure Pillars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Live Timetable Sync
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Conflict-free schedule verification
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Departmental Allocation
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Faculty & Assistant matching
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Task Progress Ledger
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Transparent academic tracking
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    Audit Ready
                  </span>
                </div>
              </div>

              {/* Bottom Security Note */}
              <div className="pt-2 text-center text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                <span>Restricted to SGGSCC Faculty & Authorized Assistants</span>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
