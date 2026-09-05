import React, { createContext, useContext, useEffect, useState } from "react";
import {
  subscribeAuthState,
  loginWithEmail,
  signUpWithEmail,
  logoutUser,
  getUserProfile,
  createOrUpdateUserProfile,
  isStudentAuthorized,
} from "../services/firebase";

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            const isStudent = !user.email.startsWith("dr.") && !user.email.includes("prof");
            const role = isStudent ? "student" : "faculty";
            const nameFromEmail = user.email
              ? user.email.split("@")[0].replace(".", " ").toUpperCase()
              : "User";

            profile = await createOrUpdateUserProfile(user.uid, {
              name: role === "faculty" ? `Dr. ${nameFromEmail}` : nameFromEmail,
              email: user.email,
              department: role === "faculty" ? "Department of Computer Science" : "B.Sc. (Hons.) Computer Science",
              course: role === "student" ? "B.Sc. (Hons.) Computer Science" : undefined,
              semester: role === "student" ? "III" : undefined,
              group: role === "student" ? "A" : undefined,
              role,
              isAvailable: true,
              availabilityStatus: "FREE",
              performanceScore: role === "student" ? 4.9 : undefined,
            });
          }
          setUserProfile(profile);
        } catch (err) {
          console.warn("AuthContext profile fetch fallback:", err);
          const isStudent = !user.email.startsWith("dr.") && !user.email.includes("prof");
          const role = isStudent ? "student" : "faculty";
          const nameFromEmail = user.email
            ? user.email.split("@")[0].replace(".", " ").toUpperCase()
            : "User";

          setUserProfile({
            uid: user.uid,
            name: role === "faculty" ? `Dr. ${nameFromEmail}` : nameFromEmail,
            email: user.email,
            department: role === "faculty" ? "Department of Computer Science" : "B.Sc. (Hons.) Computer Science",
            role,
            isAvailable: true,
            availabilityStatus: "FREE",
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, role = "faculty") => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.endsWith("@sggscc.ac.in")) {
      throw new Error("Please use your official SGGSCC college email address.");
    }

    // Whitelist check for Student role
    if (role === "student" && !isStudentAuthorized(trimmedEmail)) {
      throw new Error(
        "Access Denied: Only authorized SGGSCC student assistants (Parth & Hargun) are currently permitted access."
      );
    }

    try {
      const credential = await loginWithEmail(email, password);
      let profile = await getUserProfile(credential.user.uid);
      if (!profile) {
        const nameFormatted = email.split("@")[0].replace(".", " ");
        profile = await createOrUpdateUserProfile(credential.user.uid, {
          name: role === "faculty" ? `Dr. ${nameFormatted}` : nameFormatted,
          email,
          department: role === "faculty" ? "Department of Computer Science" : "B.Sc. (Hons.) Computer Science",
          course: role === "student" ? "B.Sc. (Hons.) Computer Science" : undefined,
          semester: role === "student" ? "III" : undefined,
          group: role === "student" ? "A" : undefined,
          role,
          isAvailable: true,
          availabilityStatus: "FREE",
          performanceScore: role === "student" ? 4.9 : undefined,
        });
      }

      // Final double check on role Profile
      if (role === "student" && !isStudentAuthorized(profile.email || trimmedEmail)) {
        throw new Error(
          "Access Denied: Only authorized SGGSCC student assistants (Parth & Hargun) are currently permitted access."
        );
      }

      setUserProfile(profile);
      return profile;
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/email-already-in-use"
      ) {
        try {
          const newCredential = await signUpWithEmail(email, password);
          const nameFormatted = email.split("@")[0].replace(".", " ");
          const profile = await createOrUpdateUserProfile(newCredential.user.uid, {
            name: role === "faculty" ? `Dr. ${nameFormatted}` : nameFormatted,
            email,
            department: role === "faculty" ? "Department of Computer Science" : "B.Sc. (Hons.) Computer Science",
            course: role === "student" ? "B.Sc. (Hons.) Computer Science" : undefined,
            semester: role === "student" ? "III" : undefined,
            group: role === "student" ? "A" : undefined,
            role,
            isAvailable: true,
            availabilityStatus: "FREE",
            performanceScore: role === "student" ? 4.9 : undefined,
          });
          setUserProfile(profile);
          return profile;
        } catch (signUpErr) {
          if (signUpErr.code === "auth/email-already-in-use") {
            const cred = await loginWithEmail(email, password);
            const nameFormatted = email.split("@")[0].replace(".", " ");
            const fallbackProf = {
              uid: cred.user.uid,
              name: role === "faculty" ? `Dr. ${nameFormatted}` : nameFormatted,
              email,
              department: role === "faculty" ? "Department of Computer Science" : "B.Sc. (Hons.) Computer Science",
              role,
              isAvailable: true,
              availabilityStatus: "FREE",
            };
            setUserProfile(fallbackProf);
            return fallbackProf;
          }
          throw signUpErr;
        }
      }
      throw err;
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
