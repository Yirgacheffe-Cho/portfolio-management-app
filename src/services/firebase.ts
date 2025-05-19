import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBk3VvV9Ek3ZMz03QjwysfZjveG3Tz19_M',
  authDomain: 'cho-project-1-82b97.firebaseapp.com',
  projectId: 'cho-project-1-82b97',
  storageBucket: 'cho-project-1-82b97.firebasestorage.app',
  messagingSenderId: '538761531458',
  appId: '1:538761531458:web:2a2b71f42ce0181d959ddb',
  measurementId: 'G-NVE3WYV7BF',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 🔥 **Emulator로 자동 연결 설정**
if (window.location.hostname === 'localhost') {
  console.log('🔥 Firebase Emulator 연결 중...');
  // Firestore Emulator 연결
  connectFirestoreEmulator(db, 'localhost', 8080);
  // Auth Emulator 연결
  connectAuthEmulator(auth, 'http://localhost:9099');
}
