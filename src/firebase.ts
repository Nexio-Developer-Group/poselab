// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyDlxnhkCH_m4CVVCdjgzF7BAS4YAk6Zn10",
  authDomain: "poselab-584a8.firebaseapp.com",
  projectId: "poselab-584a8",
  storageBucket: "poselab-584a8.firebasestorage.app",
  messagingSenderId: "350044736479",
  appId: "1:350044736479:web:aa43b1ceb0622a10a9526a",
  measurementId: "G-ZL15YJRKHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app) 

// Initialize Analytics (only if supported in this environment)
let analytics: ReturnType<typeof getAnalytics> | undefined;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized 🚀");
  } else {
    console.log("Analytics not supported in this environment");
  }
});

export { app, analytics, auth };
