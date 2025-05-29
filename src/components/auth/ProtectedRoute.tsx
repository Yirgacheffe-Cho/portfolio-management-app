import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">
        로그인 상태 확인 중...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
