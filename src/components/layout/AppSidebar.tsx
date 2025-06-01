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
import { LayoutDashboard, ListChecks, FileBox } from 'lucide-react';
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
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b px-4 py-4 text-xl font-semibold tracking-tight">
        Portfolio App
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
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
                        ? 'bg-primary/8 text-primary font-semibold rounded-md'
                        : 'hover:bg-primary/30',
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
    </Sidebar>
  );
}
