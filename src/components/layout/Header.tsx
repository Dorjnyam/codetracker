'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui';
import { getQuickActionsForRole } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { 
  Search, 
  Bell, 
  Plus, 
  Menu,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { 
    searchOpen, 
    setSearchOpen, 
    notificationsOpen, 
    setNotificationsOpen,
    profileMenuOpen,
    setProfileMenuOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    quickActionsOpen,
    setQuickActionsOpen
  } = useUIStore();

  const userRole = session?.user?.role || 'STUDENT';
  const quickActions = getQuickActionsForRole(userRole);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const notifications = [
    { id: 1, title: 'New assignment posted', time: '2 hours ago', unread: true },
    { id: 2, title: 'Code review completed', time: '4 hours ago', unread: true },
    { id: 3, title: 'Achievement unlocked', time: '1 day ago', unread: false },
    { id: 4, title: 'Class announcement', time: '2 days ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          className
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CT</span>
            </div>
            <span className="font-semibold hidden sm:block">CodeTracker</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search assignments, classes...
            <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu open={quickActionsOpen} onOpenChange={setQuickActionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Quick</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {quickActions.map((action) => (
                <DropdownMenuItem key={action.id} asChild>
                  <a href={action.href} className="flex items-center gap-2">
                    <action.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{action.label}</div>
                      {action.description && (
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      )}
                    </div>
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-xs text-muted-foreground">{notification.time}</div>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search assignments, classes, users..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Search assignments</span>
            </CommandItem>
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Search classes</span>
            </CommandItem>
            <CommandItem>
              <Search className="mr-2 h-4 w-4" />
              <span>Search users</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
