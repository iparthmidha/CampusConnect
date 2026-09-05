import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Check, Clock } from "lucide-react";
import {
  subscribeNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/firebase";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "Just now";
  const date = typeof timestamp === "number" || typeof timestamp === "string" 
    ? new Date(timestamp) 
    : timestamp.toDate ? timestamp.toDate() : new Date();
  
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function NotificationCenter({ uid }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeNotifications(uid, (data) => {
      setNotifications(data || []);
    });
    return () => unsub?.();
  }, [uid]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100"
        aria-label="View notifications"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsAsRead(uid)}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-0.5">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="h-6 w-6 text-zinc-300 dark:text-zinc-700 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  No notifications yet
                </p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  Updates on assignments and tasks will appear here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markNotificationAsRead(n.id)}
                  className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                    !n.read
                      ? "bg-zinc-50 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-100 font-medium"
                      : "bg-white dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
