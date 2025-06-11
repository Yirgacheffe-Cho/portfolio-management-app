import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/store/auth/authAtom';

export function useAuthListener() {
  const setUser = useSetAtom(authAtom);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user ?? undefined);
    });

    return () => unsub();
  }, [setUser]);
}
