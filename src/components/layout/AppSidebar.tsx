import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListChecks, FileBox, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { setOpen } = useSidebar();

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-open');
    if (saved === null) {
      const defaultOpen = isDesktop;
      setOpen(defaultOpen);
      localStorage.setItem('sidebar-open', JSON.stringify(defaultOpen));
    } else {
      setOpen(JSON.parse(saved));
    }
  }, [isDesktop, setOpen]);

  const navItems = [
    { label: '리포트', path: '/report', icon: LayoutDashboard },
    { label: '템플릿 설정', path: '/templates', icon: ListChecks },
    { label: '자산 기록', path: '/records', icon: FileBox },
    { label: '티커 검색', path: '/stock', icon: Search },
  ];

  return (
    <Sidebar {...props} className="h-full min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col justify-between">
        {/* 상단 */}
        <div>
          <SidebarHeader className="px-4 pt-6 pb-2 text-2xl font-bold tracking-tight text-primary">
            금쪽이
          </SidebarHeader>
          <div className="px-4 pb-4 text-sm text-muted-foreground">
            똑똑한 자산 관리 앱
          </div>

          <SidebarContent>
            <SidebarMenu className="space-y-1">
              {navItems.map(({ label, path, icon: Icon }) => {
                const isActive =
                  pathname === path || pathname.startsWith(path + '/');
                return (
                  <SidebarMenuItem key={path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={path}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-muted',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </div>

        {/* 하단 푸터 (진짜 아래) */}
        <div className="px-4 py-3 text-[11px] text-muted-foreground">
          © 2025 금쪽이 | v0.0.1
        </div>
      </div>
    </Sidebar>
  );
}
