import React, { useState } from "react";
import { GraduationCap, Menu, X, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ navigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-xs transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & College Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate && navigate("/")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Campus Connect
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
              Sri Guru Gobind Singh College of Commerce
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#home"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            Home
          </a>
          <a
            href="#problem"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Features
          </a>
        </nav>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate && navigate("/login")}>
            <LogIn className="h-4 w-4 mr-1" />
            Log In
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate && navigate("/login")}>
            Get Started
          </Button>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="py-1 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
              Sri Guru Gobind Singh College of Commerce
            </span>
          </div>
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            Home
          </a>
          <a
            href="#problem"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            About
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Features
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Button variant="secondary" size="md" className="w-full justify-center" onClick={() => { setMobileMenuOpen(false); navigate && navigate("/login"); }}>
              <LogIn className="h-4 w-4 mr-1" />
              Log In
            </Button>
            <Button variant="primary" size="md" className="w-full justify-center" onClick={() => { setMobileMenuOpen(false); navigate && navigate("/login"); }}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
