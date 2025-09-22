'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { optimizedThemeChange } from '@/lib/theme-optimization';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    // Use optimized theme change to prevent forced reflows
    optimizedThemeChange(setTheme, newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative overflow-hidden">
          <Sun className="theme-toggle-icon h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-200 ease-in-out dark:-rotate-90 dark:scale-0" />
          <Moon className="theme-toggle-icon absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-200 ease-in-out dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SimpleThemeToggle() {
  const { setTheme, theme } = useTheme();

  const cycleTheme = () => {
    let newTheme: 'light' | 'dark' | 'system';
    if (theme === 'light') {
      newTheme = 'dark';
    } else if (theme === 'dark') {
      newTheme = 'system';
    } else {
      newTheme = 'light';
    }
    
    // Use optimized theme change to prevent forced reflows
    optimizedThemeChange(setTheme, newTheme);
  };

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme} className="relative overflow-hidden">
      <Sun className="theme-toggle-icon h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-200 ease-in-out dark:-rotate-90 dark:scale-0" />
      <Moon className="theme-toggle-icon absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-200 ease-in-out dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
