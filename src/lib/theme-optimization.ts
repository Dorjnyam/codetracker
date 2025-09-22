// Theme optimization utilities to prevent forced reflows

/**
 * Debounced theme change to prevent rapid theme switching
 */
export function createDebouncedThemeSetter(
  setTheme: (theme: 'light' | 'dark' | 'system') => void,
  delay: number = 100
) {
  let timeoutId: NodeJS.Timeout;
  
  return (theme: 'light' | 'dark' | 'system') => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        setTheme(theme);
      });
    }, delay);
  };
}

/**
 * Optimized theme change that prevents layout thrashing
 */
export function optimizedThemeChange(
  setTheme: (theme: 'light' | 'dark' | 'system') => void,
  theme: 'light' | 'dark' | 'system'
) {
  // Use requestAnimationFrame to defer the change to the next frame
  requestAnimationFrame(() => {
    // Add a small delay to ensure the current frame is complete
    setTimeout(() => {
      setTheme(theme);
    }, 0);
  });
}

/**
 * Batch multiple theme-related updates
 */
export function batchThemeUpdates(updates: (() => void)[]) {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Check if theme change will cause a forced reflow
 */
export function willCauseReflow(element: HTMLElement): boolean {
  const computedStyle = window.getComputedStyle(element);
  const properties = [
    'width', 'height', 'margin', 'padding', 'border',
    'font-size', 'line-height', 'display', 'position'
  ];
  
  return properties.some(prop => 
    computedStyle.getPropertyValue(prop) !== 'auto' && 
    computedStyle.getPropertyValue(prop) !== 'normal'
  );
}

/**
 * Optimize CSS transitions for theme changes
 */
export function optimizeThemeTransitions() {
  // Add CSS to prevent layout shifts
  const style = document.createElement('style');
  style.textContent = `
    /* Optimize theme transitions */
    * {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
      transition-duration: 150ms !important;
    }
    
    /* Prevent layout shifts */
    html {
      will-change: auto !important;
    }
    
    /* Force hardware acceleration for animated elements */
    .theme-toggle-icon,
    [class*="transition"],
    [class*="animate"] {
      will-change: transform !important;
      transform: translateZ(0) !important;
    }
  `;
  
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
}

/**
 * Preload theme styles to prevent FOUC (Flash of Unstyled Content)
 */
export function preloadThemeStyles() {
  const themes = ['light', 'dark'];
  
  themes.forEach(theme => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = `#theme-${theme}`;
    document.head.appendChild(link);
  });
}

/**
 * Monitor theme change performance
 */
export function monitorThemePerformance() {
  let startTime: number;
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name.includes('theme') || entry.name.includes('style')) {
        console.log(`Theme performance: ${entry.name} took ${entry.duration}ms`);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure', 'navigation'] });
  
  return {
    startMeasure: (name: string) => {
      startTime = performance.now();
      performance.mark(`${name}-start`);
    },
    endMeasure: (name: string) => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    },
    cleanup: () => observer.disconnect()
  };
}

/**
 * Theme change with performance monitoring
 */
export function themeChangeWithMonitoring(
  setTheme: (theme: 'light' | 'dark' | 'system') => void,
  theme: 'light' | 'dark' | 'system',
  monitor?: ReturnType<typeof monitorThemePerformance>
) {
  monitor?.startMeasure(`theme-change-${theme}`);
  
  optimizedThemeChange(setTheme, theme);
  
  // End measurement after theme change
  setTimeout(() => {
    monitor?.endMeasure(`theme-change-${theme}`);
  }, 200);
}
