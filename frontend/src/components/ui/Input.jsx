import React from "react";
import { cn } from "../../lib/utils";

export const Label = React.forwardRef(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5", className)}
    {...props}
  >
    {children}
    {required && <span className="text-rose-600 dark:text-rose-400 ml-1">*</span>}
  </label>
));
Label.displayName = "Label";

export const Input = React.forwardRef(({ className, type = "text", error, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-zinc-950/20 dark:focus:ring-zinc-100/20",
      "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
      error
        ? "border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500/20"
        : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-100",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-zinc-950/20 dark:focus:ring-zinc-100/20",
      "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500",
      error
        ? "border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500/20"
        : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-100",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef(({ className, children, error, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 transition-colors cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-zinc-950/20 dark:focus:ring-zinc-100/20",
      "dark:bg-zinc-900 dark:text-zinc-100",
      error
        ? "border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500/20"
        : "border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-100",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
