'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui';
import { getBreadcrumbsFromPath } from '@/lib/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { 
    sidebarCollapsed, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    breadcrumbs,
    setBreadcrumbs 
  } = useUIStore();

  // Update breadcrumbs when pathname changes
  useEffect(() => {
    const newBreadcrumbs = getBreadcrumbsFromPath(pathname);
    setBreadcrumbs(newBreadcrumbs);
  }, [pathname, setBreadcrumbs]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!session) {
    return null; // Will be handled by middleware
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 transition-transform duration-300',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      )}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className={cn(
        'flex flex-col min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      )}>
        {/* Header */}
        <Header />

        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="px-4 py-2 border-b bg-muted/30">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile menu close button */}
      {mobileMenuOpen && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {/* Performance Monitor - only in development */}
      {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
    </div>
  );
}
