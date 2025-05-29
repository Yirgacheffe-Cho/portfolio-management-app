'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useLogout } from '@/hooks/auth/useLogout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Topbar() {
  const { user } = useAuth();
  const { logout } = useLogout();

  return (
    <div className="w-full h-16 border-b bg-background px-6 flex items-center justify-between">
      <div className="text-lg font-semibold text-foreground">자산관리 앱</div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.photoURL ?? ''} alt="user" />
              <AvatarFallback>
                {user.email?.[0]?.toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <span>{user.email}</span>
          </div>
          <Button size="sm" variant="outline" onClick={logout}>
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
}
