import React from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  PlusCircle,
  GraduationCap,
} from "lucide-react";
import { AppShell } from "./AppShell";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export function FacultyLayout({
  children,
  activeTab,
  setActiveTab,
  onOpenRequestModal,
  navigate,
}) {
  const { userProfile } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "requests", label: "Assistance Requests", icon: FileText },
    { id: "assistants", label: "Student Assistants", icon: Users },
  ];

  const actionButton = (
    <Button
      variant="primary"
      size="md"
      className="w-full justify-center shadow-xs font-semibold"
      onClick={onOpenRequestModal}
    >
      <PlusCircle className="h-4 w-4 mr-1.5" />
      Request Assistance
    </Button>
  );

  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FC";

  const userFooterCard = (
    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
      <div className="h-8 w-8 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 truncate">
          {userProfile?.name || "Dr. Faculty Member"}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
          {userProfile?.department || "Dept. of Computer Science"}
        </p>
      </div>
    </div>
  );

  return (
    <AppShell
      roleTitle="Faculty Portal"
      roleSubtitle="SGGSCC • Dept. of Computer Science"
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      actionButton={actionButton}
      userFooterCard={userFooterCard}
      navigate={navigate}
    >
      {children}
    </AppShell>
  );
}
