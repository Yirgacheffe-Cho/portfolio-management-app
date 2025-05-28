// hooks/report/useSnapshots.ts
import { useQuery } from '@tanstack/react-query';
import { auth, db } from '@/services/firebase';
import { getSnapshotsFromFirestore } from '@/services/reportSerivce';

export function useSnapshots() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('로그인이 필요합니다.');

  return useQuery({
    queryKey: ['snapshots', uid],
    queryFn: () => getSnapshotsFromFirestore(uid),
    enabled: !!uid, // uid 있을 때만 fetch
  });
}
