'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  themeChangeTime: number;
  renderTime: number;
  forcedReflows: number;
  lastUpdate: Date;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    themeChangeTime: 0,
    renderTime: 0,
    forcedReflows: 0,
    lastUpdate: new Date(),
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor theme changes
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('theme-change')) {
          setMetrics(prev => ({
            ...prev,
            themeChangeTime: entry.duration,
            lastUpdate: new Date(),
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Monitor forced reflows
    let reflowCount = 0;
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(element, pseudoElement) {
      reflowCount++;
      return originalGetComputedStyle.call(this, element, pseudoElement);
    };

    const updateReflowCount = () => {
      setMetrics(prev => ({
        ...prev,
        forcedReflows: reflowCount,
      }));
      reflowCount = 0;
    };

    const interval = setInterval(updateReflowCount, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.getComputedStyle = originalGetComputedStyle;
    };
  }, []);

  const getPerformanceStatus = (time: number) => {
    if (time < 16) return { status: 'excellent', color: 'bg-green-100 text-green-800' };
    if (time < 33) return { status: 'good', color: 'bg-yellow-100 text-yellow-800' };
    if (time < 50) return { status: 'fair', color: 'bg-orange-100 text-orange-800' };
    return { status: 'poor', color: 'bg-red-100 text-red-800' };
  };

  const themeStatus = getPerformanceStatus(metrics.themeChangeTime);
  const reflowStatus = metrics.forcedReflows < 5 ? 
    { status: 'low', color: 'bg-green-100 text-green-800' } : 
    { status: 'high', color: 'bg-red-100 text-red-800' };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme Change</span>
            <Badge className={themeStatus.color}>
              {metrics.themeChangeTime.toFixed(1)}ms
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Forced Reflows</span>
            <Badge className={reflowStatus.color}>
              {metrics.forcedReflows}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Update</span>
            <span className="text-xs text-muted-foreground">
              {metrics.lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Optimized theme switching active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
