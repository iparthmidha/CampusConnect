import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useRouter } from "./hooks/useRouter";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProblemPurpose } from "./components/ProblemPurpose";
import { HowItWorks } from "./components/HowItWorks";
import { CoreFeatures } from "./components/CoreFeatures";
import { WhyCampusConnect } from "./components/WhyCampusConnect";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { LoginPage } from "./pages/LoginPage";
import { FacultyDashboard } from "./pages/FacultyDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { isStudentAuthorized, db } from "./services/firebase";
import { collection, getDocs } from "firebase/firestore";

function DebugPage() {
  const [data, setData] = React.useState("Loading...");

  React.useEffect(() => {
    async function fetchData() {
      let result = "--- ASSISTANCE REQUESTS ---\n";
      const reqSnap = await getDocs(collection(db, "assistanceRequests"));
      reqSnap.forEach(doc => {
        result += `ID: ${doc.id}\n`;
        result += `FacultyID: ${doc.data().facultyId}\n`;
        result += `FacultyEmail: ${doc.data().facultyEmail}\n`;
        result += `Status: ${doc.data().status}\n`;
        result += `Title: ${doc.data().title}\n\n`;
      });
      
      result += "--- USERS ---\n";
      const userSnap = await getDocs(collection(db, "users"));
      userSnap.forEach(doc => {
        result += `ID: ${doc.id}\n`;
        result += `Email: ${doc.data().email}\n`;
        result += `Role: ${doc.data().role}\n\n`;
      });
      
      setData(result);
    }
    fetchData();
  }, []);

  return <pre className="p-8 text-xs">{data}</pre>;
}

function MainLandingPage({ navigate }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-950 dark:text-zinc-50 transition-colors selection:bg-zinc-950 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      <Navbar navigate={navigate} />
      <main>
        <Hero navigate={navigate} />
        <ProblemPurpose />
        <HowItWorks />
        <CoreFeatures />
        <WhyCampusConnect />
        <FinalCTA navigate={navigate} />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedFacultyRoute({ navigate }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-400">
        <p className="text-sm font-medium">Verifying SGGSCC credentials...</p>
      </div>
    );
  }

  // Protected Guard: Redirect to /login if unauthenticated or wrong role
  if (!currentUser || !userProfile || userProfile.role !== "faculty") {
    if (typeof window !== "undefined") {
      setTimeout(() => navigate("/login"), 0);
    }
    return null;
  }

  return <FacultyDashboard navigate={navigate} />;
}

function ProtectedStudentRoute({ navigate, currentPath }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-400">
        <p className="text-sm font-medium">Verifying SGGSCC student authorization...</p>
      </div>
    );
  }

  // Protected Guard: Redirect to /login if unauthenticated or wrong role
  if (!currentUser || !userProfile || userProfile.role !== "student") {
    if (typeof window !== "undefined") {
      setTimeout(() => navigate("/login"), 0);
    }
    return null;
  }

  // Student Authorization Whitelist Guard
  if (!isStudentAuthorized(userProfile.email)) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-950 dark:text-zinc-50 p-4 text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 max-w-md">
          <h2 className="text-lg font-bold mb-1">Access Restricted</h2>
          <p className="text-xs">
            Only authorized SGGSCC student assistants (Parth & Hargun) are currently permitted access to the Student Portal.
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:underline"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return <StudentDashboard navigate={navigate} currentPath={currentPath} />;
}

function AppRouter() {
  const { currentPath, navigate } = useRouter();

  if (currentPath === "/login") {
    return <LoginPage navigate={navigate} />;
  }

  if (currentPath === "/debug") {
    return <DebugPage />;
  }

  if (currentPath === "/faculty-dashboard") {
    return <ProtectedFacultyRoute navigate={navigate} />;
  }

  if (currentPath === "/student-dashboard" || currentPath.startsWith("/student/")) {
    return <ProtectedStudentRoute navigate={navigate} currentPath={currentPath} />;
  }

  return <MainLandingPage navigate={navigate} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
