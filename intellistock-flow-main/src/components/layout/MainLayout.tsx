import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';

interface MainLayoutProps {
  children: React.ReactNode;
  lastUpdate?: Date;
  isRefreshing?: boolean;
  refreshInterval?: number;
}

export function MainLayout({
  children,
  lastUpdate = new Date(),
  isRefreshing = false,
  refreshInterval = 30,
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            </div>
            <LiveIndicator
              lastUpdate={lastUpdate}
              isRefreshing={isRefreshing}
              refreshInterval={refreshInterval}
            />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto grid-lines">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
