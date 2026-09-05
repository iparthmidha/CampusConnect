import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, './.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const firebaseConfig = {
  apiKey: envConfig.VITE_FIREBASE_API_KEY,
  authDomain: envConfig.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envConfig.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envConfig.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envConfig.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envConfig.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Fetching assistanceRequests...");
  const snap = await getDocs(collection(db, "assistanceRequests"));
  console.log(`Found ${snap.docs.length} documents.`);
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log("----");
    console.log("ID:", doc.id);
    console.log("FacultyID:", data.facultyId);
    console.log("Status:", data.status);
    console.log("Title:", data.title);
  });
  console.log("----");
  
  console.log("Fetching users...");
  const usersSnap = await getDocs(collection(db, "users"));
  usersSnap.docs.forEach(doc => {
    const data = doc.data();
    console.log("User:", doc.id, "Email:", data.email, "Role:", data.role);
  });
  process.exit(0);
}

run();
