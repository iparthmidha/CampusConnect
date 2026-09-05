import React, { useState } from "react";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Building2,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input, Label } from "../components/ui/Input";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export function LoginPage({ navigate }) {
  const { login } = useAuth();

  const [role, setRole] = useState("faculty"); // 'faculty' | 'student'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setFormError("");
    setForgotPasswordMsg("");

    let isValid = true;
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Please enter your college email address.");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError("Please enter a valid email address.");
        isValid = false;
      } else if (!trimmedEmail.toLowerCase().endsWith("@sggscc.ac.in")) {
        setEmailError("Please use your official SGGSCC college email address.");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    try {
      const profile = await login(trimmedEmail, password, role);
      if (profile.role === "faculty" || role === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      console.error("Firebase Login Error:", err);
      setFormError(
        err.message || "Failed to authenticate with SGGSCC credentials. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordMsg(
      "Password recovery instructions are managed by SGGSCC IT Administration. Please contact support@sggscc.ac.in."
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 flex flex-col justify-between transition-colors selection:bg-zinc-950 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      {/* Top Header */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Campus Connect
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                Sri Guru Gobind Singh College of Commerce
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate("/")}
              className="text-xs h-8"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Login Form Area */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Institutional Information */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
              <Building2 className="h-3.5 w-3.5" />
              <span>SGGSCC Academic Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
              Academic Coordination Infrastructure
            </h1>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Sign in with your official SGGSCC institutional account to access the Faculty or Student Assistant workspace.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs">
                <ShieldCheck className="h-4 w-4 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                <div className="text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-950 dark:text-zinc-100 block">
                    Domain Authentication Required
                  </span>
                  Restricted to authenticated <code className="font-mono text-zinc-900 dark:text-zinc-200 font-medium">@sggscc.ac.in</code> institutional accounts.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs">
                <Lock className="h-4 w-4 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                <div className="text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-950 dark:text-zinc-100 block">
                    Role-Based Access Control
                  </span>
                  Faculty members and registered student assistants access separate tailored workflows.
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="lg:col-span-6 flex justify-center">
            <Card className="w-full max-w-md p-6 sm:p-7 bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 shadow-lg space-y-5">
              <div>
                <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  Sign In to Workspace
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Select your portal role and enter your institutional credentials.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Selector Tabs */}
                <div>
                  <Label>Portal Role</Label>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700">
                    <button
                      type="button"
                      onClick={() => {
                        setRole("faculty");
                        setEmailError("");
                        setPasswordError("");
                        setFormError("");
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        role === "faculty"
                          ? "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-2xs font-bold"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                      }`}
                    >
                      Faculty Member
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole("student");
                        setEmailError("");
                        setPasswordError("");
                        setFormError("");
                      }}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        role === "student"
                          ? "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-2xs font-bold"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                      }`}
                    >
                      Student Assistant
                    </button>
                  </div>
                </div>

                {/* College Email */}
                <div>
                  <Label htmlFor="login-email" required>
                    Institutional Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="e.g. yourname@sggscc.ac.in"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setFormError("");
                    }}
                    error={!!emailError}
                  />
                  {emailError && (
                    <div className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="login-password" required className="mb-0">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                        setFormError("");
                      }}
                      error={!!passwordError}
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>

                {forgotPasswordMsg && (
                  <div className="p-2.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {forgotPasswordMsg}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-xs font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In to Portal
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center text-[10px] text-zinc-400">
                Institutional Access • Sri Guru Gobind Singh College of Commerce
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-3 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Campus Connect — Sri Guru Gobind Singh College of Commerce
      </footer>
    </div>
  );
}
