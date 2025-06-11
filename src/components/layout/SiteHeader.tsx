// components/layout/SiteHeader.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/auth/useAuth';
import { useLogout } from '@/hooks/auth/useLogout';
import { LogOut } from 'lucide-react';

export function SiteHeader() {
  const { user } = useAuth();
  const { logout } = useLogout();
  const { open, setOpen } = useSidebar();

  const handleSidebarToggle = () => {
    const next = !open;
    setOpen(next);
    localStorage.setItem('sidebar-open', JSON.stringify(next));
  };

  return (
    <header className="flex h-[--header-height] items-center border-b px-4 lg:px-6 bg-background">
      {/* ✅ 햄버거 버튼 클릭 → 열고 닫힘 토글 */}
      <SidebarTrigger className="-ml-1" onClick={handleSidebarToggle} />

      <h1 className="ml-4 text-lg font-semibold">자산관리 앱</h1>

      <div className="ml-auto flex items-center gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user.photoURL ?? ''} alt="user" />
                <AvatarFallback>
                  {user.email?.[0]?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-lg">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
