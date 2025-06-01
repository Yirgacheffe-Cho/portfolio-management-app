// components/layout/AppLayout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { SiteHeader } from './SiteHeader';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '260px',
          '--header-height': '64px',
        } as React.CSSProperties
      }
    >
      <AppSidebar collapsible="offcanvas" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col overflow-auto bg-background px-4 py-6 lg:px-6">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <Outlet /> {/* ✅ 핵심: children 대신 Outlet */}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
