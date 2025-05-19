import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBk3VvV9Ek3ZMz03QjwysfZjveG3Tz19_M",
  authDomain: "cho-project-1-82b97.firebaseapp.com",
  projectId: "cho-project-1-82b97",
  storageBucket: "cho-project-1-82b97.firebasestorage.app",
  messagingSenderId: "538761531458",
  appId: "1:538761531458:web:2a2b71f42ce0181d959ddb",
  measurementId: "G-NVE3WYV7BF"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase Analytics 초기화
const analytics = getAnalytics(app);

// Firebase 서비스들 내보내기
export const db = getFirestore(app);               // Firestore (데이터베이스)
export const auth = getAuth(app);                  // Firebase Auth (인증)
export const provider = new GoogleAuthProvider();  // Google Auth Provider