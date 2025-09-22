'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui';
import { navigationItems, profileItems, getNavigationForRole } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Trophy, 
  Zap,
  Activity,
  Target
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const userRole = session?.user?.role || 'STUDENT';
  const filteredNavigation = getNavigationForRole(userRole);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/overview';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, level = 0 }: { item: any; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href || '');

    return (
      <div>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            active && 'bg-accent text-accent-foreground',
            level > 0 && 'ml-4',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          {item.href ? (
            <Link href={item.href} className="flex items-center gap-2 flex-1">
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </div>
          )}
          
          {hasChildren && !sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleExpanded(item.id)}
            >
              {isExpanded ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>

        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="ml-4 space-y-1">
            {item.children.map((child: any) => (
              <NavItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background border-r transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CT</span>
            </div>
            <span className="font-semibold">CodeTracker</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8 p-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Stats */}
      {!sidebarCollapsed && session?.user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{session.user.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{session.user.role}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              <span>Level 5</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span>2,450 XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-green-500" />
              <span>7 day streak</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-purple-500" />
              <span>75% complete</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredNavigation.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>

        <Separator className="my-2" />

        {/* Profile Section */}
        <div className="p-2 space-y-1">
          {profileItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
