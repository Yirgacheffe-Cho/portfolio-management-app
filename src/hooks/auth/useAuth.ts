import { useAtomValue } from 'jotai';
import { authAtom } from '@/store/auth/authAtom';

export function useAuth() {
  const user = useAtomValue(authAtom);

  return {
    user,
    isLoggedIn: !!user,
    isLoading: user === null,
  };
}
