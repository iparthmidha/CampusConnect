import React, { useState } from "react";
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/ThemeToggle";
import { NotificationCenter } from "../components/NotificationCenter";
import { useAuth } from "../context/AuthContext";

export function AppShell({
  roleTitle = "Academic Portal",
  roleSubtitle = "SGGSCC • University of Delhi",
  navItems = [],
  activeTab,
  onSelectTab,
  actionButton,
  userFooterCard,
  navigate,
  children,
}) {
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (navigate) navigate("/login");
    else window.location.pathname = "/login";
  };

  const activeItem = navItems.find((item) => item.id === activeTab);
  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CC";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col md:flex-row transition-colors selection:bg-zinc-950 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      
      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* INSTITUTIONAL SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 md:w-68 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-5">
          {/* Logo & College Identity */}
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => navigate ? navigate("/") : (window.location.pathname = "/")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs group-hover:scale-102 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Campus Connect
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {roleTitle}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="md:hidden rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Slot (e.g., Primary "Request Assistance" Button) */}
          {actionButton && (
            <div className="pt-1">
              {actionButton}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isActive
                          ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-900"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User Profile Card & Sign Out */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          {userFooterCard ? (
            userFooterCard
          ) : (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80">
              <div className="h-8 w-8 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                  {userProfile?.name || "Academic User"}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {userProfile?.department || userProfile?.course || roleSubtitle}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center text-xs h-8"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* INSTITUTIONAL HEADER BAR */}
        <header className="sticky top-0 z-30 h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden rounded-lg p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                {roleTitle}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
              <span className="font-bold text-zinc-950 dark:text-zinc-50">
                {activeItem?.label || "Overview"}
              </span>
            </div>
          </div>

          {/* Header Controls: Notification, Theme, Profile pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {userProfile?.uid && <NotificationCenter uid={userProfile.uid} />}
            <ThemeToggle />

            {/* Desktop User Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
              <div className="h-7 w-7 rounded-full bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-[11px] flex items-center justify-center">
                {initials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 leading-tight truncate max-w-[140px]">
                  {userProfile?.name || "User"}
                </span>
                <span className="text-[10px] text-zinc-500 leading-none truncate max-w-[140px]">
                  {userProfile?.email || "sggscc.ac.in"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
