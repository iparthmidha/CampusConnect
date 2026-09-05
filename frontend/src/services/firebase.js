import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// AUTHORIZED STUDENT WHITELIST
export const AUTHORIZED_STUDENT_EMAILS = [
  "parth.254012@sggscc.ac.in",
  "hargun.254004@sggscc.ac.in",
];

export function isStudentAuthorized(email) {
  if (!email) return false;
  return AUTHORIZED_STUDENT_EMAILS.includes(email.toLowerCase().trim());
}

// In-Memory Local Fallback Storage
let localRequestsStore = [];
let localNotificationsStore = [];
let localRequestsSubscribers = [];
let localNotificationsSubscribers = [];
let localStudentAvailabilityStore = {};

/* ==========================================================================
   AUTHENTICATION & USER PROFILE SERVICES
   ========================================================================== */

export async function loginWithEmail(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  return await signOut(auth);
}

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { uid, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.warn("Firestore getUserProfile fallback:", err);
    return null;
  }
}

export async function createOrUpdateUserProfile(uid, data) {
  try {
    const userDocRef = doc(db, "users", uid);
    const existingSnap = await getDoc(userDocRef).catch(() => ({ exists: () => false }));
    const profileData = {
      ...data,
      updatedAt: new Date().toISOString(),
      ...(existingSnap.exists() ? {} : { createdAt: new Date().toISOString() }),
    };
    await setDoc(userDocRef, profileData, { merge: true }).catch((err) => {
      console.warn("Firestore setDoc fallback:", err);
    });
    return { uid, ...profileData };
  } catch (err) {
    console.warn("Fallback saving profile locally:", err);
    return { uid, ...data };
  }
}

/* ==========================================================================
   STUDENT AVAILABILITY & TASK ACCEPT/DECLINE SERVICES
   ========================================================================== */

export async function updateStudentAvailability(studentId, isAvailable, availabilityStatus) {
  try {
    const studentRef = doc(db, "studentAssistants", studentId);
    await setDoc(
      studentRef,
      { isAvailable, availabilityStatus, updatedAt: new Date().toISOString() },
      { merge: true }
    ).catch(() => {});

    const userRef = doc(db, "users", studentId);
    await setDoc(
      userRef,
      { isAvailable, availabilityStatus, updatedAt: new Date().toISOString() },
      { merge: true }
    ).catch(() => {});
  } catch (err) {
    console.warn("Update student availability fallback:", err);
  }

  localStudentAvailabilityStore[studentId] = { isAvailable, availabilityStatus };
}

export async function acceptAssistanceRequest(requestId, studentUser) {
  const studentId = studentUser.uid || studentUser.id || "st_1";
  const studentName = studentUser.name || studentUser.email.split("@")[0];

  try {
    const requestRef = doc(db, "assistanceRequests", requestId);
    let facultyIdToNotify = null;
    let requestTitle = "";

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(requestRef);
      if (!snap.exists()) {
        throw new Error("Assistance request does not exist.");
      }
      
      const currentData = snap.data();
      if (currentData.status !== "PENDING") {
        throw new Error("This assistance request is no longer available.");
      }

      transaction.update(requestRef, {
        status: "ACCEPTED",
        assignedStudentId: studentId,
        assignedStudentName: studentName,
        assignedStudentEmail: studentUser.email,
        updatedAt: new Date().toISOString(),
      });

      facultyIdToNotify = currentData.facultyId;
      requestTitle = currentData.title;
    });

    if (facultyIdToNotify) {
      await createNotification({
        userId: facultyIdToNotify,
        title: "Assistance Request Accepted!",
        message: `${studentName} accepted your request "${requestTitle}".`,
        type: "REQUEST_ACCEPTED",
        relatedRequestId: requestId,
      });
    }
  } catch (err) {
    console.warn("Firestore accept request fallback/error:", err);
    throw err; // Ensure the caller catches the specific transaction error
  }

  // Update local store
  localRequestsStore = localRequestsStore.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "ACCEPTED",
          assignedStudentId: studentId,
          assignedStudentName: studentName,
        }
      : r
  );
  localRequestsSubscribers.forEach((cb) => cb([...localRequestsStore]));

  // Create local notification for student confirmation
  await createNotification({
    userId: studentId,
    title: "Task Assigned",
    message: `You have successfully accepted the request.`,
    type: "TASK_ASSIGNED",
    relatedRequestId: requestId,
  });
}

export async function declineAssistanceRequest(requestId, studentId) {
  try {
    const notifsRef = collection(db, "notifications");
    const snap = await getDocs(notifsRef);
    snap.docs.forEach(async (d) => {
      const data = d.data();
      if (data.relatedRequestId === requestId) {
        await updateDoc(doc(db, "notifications", d.id), { read: true, status: "DECLINED" }).catch(() => {});
      }
    });
  } catch (err) {
    console.warn("Decline request fallback:", err);
  }

  localNotificationsStore = localNotificationsStore.map((n) =>
    n.relatedRequestId === requestId ? { ...n, read: true, status: "DECLINED" } : n
  );
  localNotificationsSubscribers.forEach((cb) => cb([...localNotificationsStore]));
}

export async function startAssistanceTask(taskId, studentUser) {
  try {
    const requestRef = doc(db, "assistanceRequests", taskId);
    const snap = await getDoc(requestRef);

    if (snap.exists()) {
      const currentData = snap.data();
      await updateDoc(requestRef, {
        status: "IN_PROGRESS",
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (currentData.facultyId) {
        await createNotification({
          userId: currentData.facultyId,
          title: "Task Started",
          message: `${studentUser.name} has started your task "${currentData.title}".`,
          type: "TASK_STARTED",
          relatedRequestId: taskId,
        });
      }
    }
  } catch (err) {
    console.warn("Firestore start task fallback:", err);
  }

  localRequestsStore = localRequestsStore.map((r) =>
    r.id === taskId
      ? { ...r, status: "IN_PROGRESS", startedAt: new Date().toISOString() }
      : r
  );
  localRequestsSubscribers.forEach((cb) => cb([...localRequestsStore]));
}

export async function completeAssistanceTask(taskId, studentUser) {
  try {
    const requestRef = doc(db, "assistanceRequests", taskId);
    const snap = await getDoc(requestRef);

    if (snap.exists()) {
      const currentData = snap.data();
      await updateDoc(requestRef, {
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (currentData.facultyId) {
        await createNotification({
          userId: currentData.facultyId,
          title: "Task Completed",
          message: `${studentUser.name} has completed your task "${currentData.title}".`,
          type: "TASK_COMPLETED",
          relatedRequestId: taskId,
        });
      }
    }
  } catch (err) {
    console.warn("Firestore complete task fallback:", err);
  }

  localRequestsStore = localRequestsStore.map((r) =>
    r.id === taskId
      ? { ...r, status: "COMPLETED", completedAt: new Date().toISOString() }
      : r
  );
  localRequestsSubscribers.forEach((cb) => cb([...localRequestsStore]));
}

export function subscribeStudentPendingRequests(callback) {
  try {
    const requestsRef = collection(db, "assistanceRequests");
    const q = query(requestsRef, where("status", "==", "PENDING"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const pending = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        pending.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        callback(pending);
      },
      (err) => {
        console.warn("Firestore student pending requests fallback:", err);
      }
    );

    localRequestsSubscribers.push(callback);
    return () => {
      unsubscribe();
      localRequestsSubscribers = localRequestsSubscribers.filter((cb) => cb !== callback);
    };
  } catch (err) {
    console.warn("Failed to subscribe to student pending requests:", err);
    return () => {};
  }
}

export function subscribeStudentTasks(studentId, callback) {
  try {
    const requestsRef = collection(db, "assistanceRequests");
    const q = query(requestsRef, where("assignedStudentId", "==", studentId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(tasks);
      },
      (err) => {
        console.warn("Firestore student tasks listener fallback:", err);
      }
    );

    return () => unsubscribe();
  } catch (err) {
    console.warn("Failed to subscribe to student tasks:", err);
    return () => {};
  }
}

/* ==========================================================================
   FACULTY ASSISTANCE REQUEST SERVICES
   ========================================================================== */

export async function createAssistanceRequest(facultyUser, requestData) {
  const newRequest = {
    id: `req_${Date.now()}`,
    facultyId: facultyUser.uid,
    facultyName: facultyUser.name || facultyUser.email.split("@")[0],
    facultyEmail: facultyUser.email,
    title: requestData.title,
    description: requestData.description,
    requiredSkills: Array.isArray(requestData.requiredSkills)
      ? requestData.requiredSkills
      : requestData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
    preferredDate: requestData.preferredDate || new Date().toISOString().split("T")[0],
    preferredStartTime: requestData.preferredStartTime || "15:00",
    preferredEndTime: requestData.preferredEndTime || "17:00",
    duration: requestData.duration || "2 Hours",
    priority: requestData.priority || "Medium",
    location: requestData.location || "SGGSCC Main Building",
    notes: requestData.notes || "",
    status: "PENDING",
    assignedStudentId: null,
    assignedStudentName: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const requestsRef = collection(db, "assistanceRequests");
    const docRef = await addDoc(requestsRef, {
      ...newRequest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    newRequest.id = docRef.id;
  } catch (err) {
    console.warn("Firestore request write fallback:", err);
  }

  localRequestsStore = [newRequest, ...localRequestsStore];
  localRequestsSubscribers.forEach((cb) => cb([...localRequestsStore]));

  // Create notifications for faculty and student accounts
  await createNotification({
    userId: facultyUser.uid,
    title: "Assistance Request Created",
    message: `Your request "${requestData.title}" has been created and set to PENDING.`,
    type: "REQUEST_CREATED",
    relatedRequestId: newRequest.id,
  });

  return newRequest;
}

export function subscribeFacultyRequests(facultyId, callback) {
  try {
    const requestsRef = collection(db, "assistanceRequests");
    const q = query(requestsRef, where("facultyId", "==", facultyId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        requests.sort((a, b) => {
          const timeA = a.createdAt?.seconds || (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() / 1000 : 0);
          const timeB = b.createdAt?.seconds || (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() / 1000 : 0);
          return timeB - timeA;
        });
        callback(requests);
      },
      (err) => {
        console.error("Firestore request listener ERROR:", err);
      }
    );

    localRequestsSubscribers.push(callback);
    return () => {
      unsubscribe();
      localRequestsSubscribers = localRequestsSubscribers.filter((cb) => cb !== callback);
    };
  } catch (err) {
    console.error("Failed to subscribe to faculty requests:", err);
    return () => {};
  }
}

/* ==========================================================================
   STUDENT ASSISTANT SERVICES & SEED DATA
   ========================================================================== */

const sampleStudents = [
  {
    id: "parth_254012",
    name: "Parth",
    email: "parth.254012@sggscc.ac.in",
    department: "B.Sc. (Hons.) Computer Science",
    course: "B.Sc. (Hons.) Computer Science",
    semester: "III",
    group: "A",
    skills: ["Python", "SQL", "DBMS", "Java", "Lab Assistance"],
    availabilityStatus: "FREE",
    isAvailable: true,
    activeTaskCount: 0,
    completedTaskCount: 12,
    performanceScore: 4.9,
    timetableSlot: "Free (15:00 - 17:00)",
  },
  {
    id: "hargun_254004",
    name: "Hargun",
    email: "hargun.254004@sggscc.ac.in",
    department: "B.Sc. (Hons.) Computer Science",
    course: "B.Sc. (Hons.) Computer Science",
    semester: "III",
    group: "A",
    skills: ["C++", "SQL", "Data Structures", "OS Lab Support"],
    availabilityStatus: "FREE",
    isAvailable: true,
    activeTaskCount: 0,
    completedTaskCount: 15,
    performanceScore: 4.8,
    timetableSlot: "Free (15:00 - 17:00)",
  },
];

export function subscribeAvailableStudents(callback) {
  try {
    const studentsRef = collection(db, "studentAssistants");
    const unsubscribe = onSnapshot(
      studentsRef,
      (snapshot) => {
        if (snapshot.empty) {
          callback(sampleStudents);
        } else {
          const students = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          callback(students);
        }
      },
      (err) => {
        console.warn("Firestore student listener fallback to sample data:", err);
        callback(sampleStudents);
      }
    );

    setTimeout(() => callback(sampleStudents), 1000);
    return () => unsubscribe();
  } catch (err) {
    callback(sampleStudents);
    return () => {};
  }
}

/* ==========================================================================
   NOTIFICATION SERVICES
   ========================================================================== */

export async function createNotification({ userId, title, message, type = "INFO", relatedRequestId = null }) {
  const notif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title,
    message,
    type,
    relatedRequestId,
    read: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const notificationsRef = collection(db, "notifications");
    await addDoc(notificationsRef, { ...notif, createdAt: serverTimestamp() });
  } catch (err) {
    console.warn("Firestore notification write fallback:", err);
  }

  localNotificationsStore = [notif, ...localNotificationsStore];
  localNotificationsSubscribers.forEach((cb) => cb([...localNotificationsStore]));
}

export function subscribeNotifications(userId, callback) {
  try {
    const notificationsRef = collection(db, "notifications");
    // Broadcast notification retrieval: fetch user specific AND broadcast student notifications
    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((n) => !n.userId || n.userId === userId || n.type === "NEW_MATCHED_REQUEST");
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        callback(list);
      },
      (err) => {
        console.warn("Firestore notification listener fallback to local store:", err);
        const filtered = localNotificationsStore.filter(
          (n) => !n.userId || n.userId === userId || n.type === "NEW_MATCHED_REQUEST"
        );
        callback(filtered);
      }
    );

    setTimeout(() => {
      const filtered = localNotificationsStore.filter(
        (n) => !n.userId || n.userId === userId || n.type === "NEW_MATCHED_REQUEST"
      );
      callback(filtered);
    }, 1000);

    localNotificationsSubscribers.push(callback);
    return () => {
      unsubscribe();
      localNotificationsSubscribers = localNotificationsSubscribers.filter((cb) => cb !== callback);
    };
  } catch (err) {
    callback([]);
    return () => {};
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const notifRef = doc(db, "notifications", notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (err) {
    console.warn("Firestore markNotificationAsRead fallback:", err);
  }
  localNotificationsStore = localNotificationsStore.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  localNotificationsSubscribers.forEach((cb) => cb([...localNotificationsStore]));
}

export async function markAllNotificationsAsRead(userId) {
  localNotificationsStore = localNotificationsStore.map((n) =>
    !n.userId || n.userId === userId ? { ...n, read: true } : n
  );
  localNotificationsSubscribers.forEach((cb) => cb([...localNotificationsStore]));
}
