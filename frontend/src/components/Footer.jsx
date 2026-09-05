import React from "react";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Campus Connect
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Faculty–Student Coordination Platform for Sri Guru Gobind Singh College of Commerce.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-6 flex flex-wrap items-center md:justify-end gap-6 text-sm font-medium">
            <a
              href="#privacy"
              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#terms"
              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#contact"
              className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 gap-2">
          <span>
            © {new Date().getFullYear()} Campus Connect. Sri Guru Gobind Singh College of Commerce. All rights reserved.
          </span>
          <span className="font-medium">
            Digital Infrastructure Project
          </span>
        </div>
      </div>
    </footer>
  );
}
