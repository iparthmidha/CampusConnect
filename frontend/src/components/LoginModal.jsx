import React, { useState } from "react";
import { X, GraduationCap, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function LoginModal({ isOpen, onClose }) {
  const [role, setRole] = useState("faculty"); // 'faculty' | 'student'
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your college email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid institutional email address.");
      return;
    }

    // Optional hint if not using sggscc domain
    if (!trimmed.toLowerCase().endsWith("@sggscc.ac.in") && !trimmed.toLowerCase().endsWith(".edu") && !trimmed.toLowerCase().endsWith(".ac.in")) {
      setError("Note: Official Sri Guru Gobind Singh College of Commerce emails usually end with @sggscc.ac.in.");
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setEmail("");
    setError("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl p-6 text-zinc-950 dark:text-zinc-50">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Institutional Portal Access</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Sri Guru Gobind Singh College of Commerce
            </p>
          </div>
        </div>

        {submitted ? (
          /* Success / Verification State */
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <Badge variant="dark" className="mb-2">
                {role === "faculty" ? "Faculty Member" : "Student Assistant"}
              </Badge>
              <h4 className="text-base font-semibold">Email Verified</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Access link dispatched to <span className="font-mono font-medium text-zinc-950 dark:text-zinc-100">{email}</span>.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="primary" size="md" className="w-full" onClick={handleReset}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={validateEmail} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Select Academic Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => { setRole("faculty"); setError(""); }}
                  className={`py-2 text-xs font-semibold rounded-md transition-all ${
                    role === "faculty"
                      ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-950 dark:text-zinc-50"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Faculty Member
                </button>
                <button
                  type="button"
                  onClick={() => { setRole("student"); setError(""); }}
                  className={`py-2 text-xs font-semibold rounded-md transition-all ${
                    role === "student"
                      ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-950 dark:text-zinc-50"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  Student Assistant
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="college-email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                College Email Address
              </label>
              <input
                id="college-email"
                type="email"
                placeholder={role === "faculty" ? "faculty.name@sggscc.ac.in" : "student.roll@sggscc.ac.in"}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100"
              />
              {error && (
                <div className="mt-2 flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Trust Note */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              <ShieldCheck className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              <span>Authenticates via SGGSCC Institutional SSO</span>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" className="w-full justify-center">
                Continue to Portal
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
