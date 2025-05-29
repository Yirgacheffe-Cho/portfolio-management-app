import { signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '@/services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

type UseLoginOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export function useLogin({ onSuccess, onError }: UseLoginOptions = {}) {
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      if (!result.user) throw new Error('로그인 사용자 없음');

      const { uid, displayName, email, photoURL } = result.user;
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      // 최초 로그인일 때만 생성
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
          createdAt: serverTimestamp(),
        });
      } else {
        // 선택: 마지막 로그인 기록만 업데이트하고 싶을 경우
        await setDoc(
          userRef,
          {
            lastLoginAt: serverTimestamp(),
          },
          { merge: true },
        );
      }

      onSuccess?.();
    } catch (error) {
      console.error('로그인 오류:', error);
      onError?.(error);
    }
  };

  return { login };
}
