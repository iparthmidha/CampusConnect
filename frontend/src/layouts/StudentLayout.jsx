import React from "react";
import {
  LayoutDashboard,
  FileCheck,
  Clock,
  Calendar,
  User,
  Star,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "./AppShell";
import { useAuth } from "../context/AuthContext";

export function StudentLayout({
  children,
  activeTab,
  setActiveTab,
  navigate,
}) {
  const { userProfile } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "tasks", label: "My Tasks & Ledger", icon: FileCheck },
    { id: "availability", label: "Live Availability", icon: Clock },
    { id: "timetable", label: "Timetable Schedule", icon: Calendar },
    { id: "profile", label: "Assistant Dossier", icon: User },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (navigate) {
      if (tabId === "dashboard") {
        navigate("/student-dashboard");
      } else {
        navigate(`/student/${tabId}`);
      }
    }
  };

  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  const userFooterCard = (
    <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 truncate">
              {userProfile?.name || "Student Assistant"}
            </p>
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
            {userProfile?.course || "B.Sc. (H) CS • Group A"}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
        <span>Performance Rating</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
          {userProfile?.performanceScore || "4.9 / 5.0"}
        </span>
      </div>
    </div>
  );

  return (
    <AppShell
      roleTitle="Student Portal"
      roleSubtitle="B.Sc. (H) CS • Group A"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      userFooterCard={userFooterCard}
      navigate={navigate}
    >
      {children}
    </AppShell>
  );
}
