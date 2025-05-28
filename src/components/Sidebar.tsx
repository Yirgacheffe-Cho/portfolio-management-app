import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Tailwind class merge 유틸
import { LayoutDashboard, ListChecks, FileBox } from 'lucide-react';

/**
 * 🧭 Sidebar
 * - 좌측 고정 네비게이션
 * - 현재 경로 기준으로 활성화된 메뉴 강조
 */
export function Sidebar() {
  const menuItems = [
    {
      name: '리포트',
      path: '/report',
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
    {
      name: '템플릿 설정',
      path: '/templates',
      icon: <ListChecks className="w-4 h-4 mr-2" />,
    },
    {
      name: '자산 기록',
      path: '/records',
      icon: <FileBox className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <aside className="w-64 h-full border-r bg-background text-foreground flex flex-col">
      <div className="px-4 py-5 text-xl font-semibold tracking-tight border-b">
        Portfolio App
      </div>
      <nav className="flex-1 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-muted text-foreground border-l-4 border-primary'
                  : 'hover:bg-muted/50 text-muted-foreground',
              )
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
