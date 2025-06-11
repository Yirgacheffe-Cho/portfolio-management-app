import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider, db } from '@/services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();

  // 🔐 인증 완료 대기 함수
  const waitForAuthReady = () =>
    new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsub();
          resolve(user);
        }
      });
    });

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      if (!result.user) return;

      const { uid, displayName, email, photoURL } = result.user;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      // 🔄 기존 유저 → 마지막 로그인 시간만 갱신
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          lastLoginAt: new Date(),
        });
      } else {
        // 🆕 신규 유저 → 문서 생성
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
          createdAt: new Date(),
        });
      }

      // ✅ auth 상태 완전히 반영될 때까지 대기
      await waitForAuthReady();

      // 🚀 페이지 이동
      navigate('/report', { replace: true });
    } catch (error) {
      console.error('로그인 에러:', error);
    }
  };

  return { login };
}
