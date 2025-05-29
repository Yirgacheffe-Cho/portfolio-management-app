import { signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/store/auth/authAtom';

export function useLogout() {
  const setAuth = useSetAtom(authAtom);

  const logout = async () => {
    await signOut(auth);
    setAuth(undefined); // 👉 안전하게 초기화
  };

  return { logout };
}
