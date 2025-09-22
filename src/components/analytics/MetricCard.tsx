'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  trend?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  unit = '', 
  trend, 
  icon, 
  color = 'blue',
  className 
}: MetricCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-blue-500',
        };
      case 'green':
        return {
          bg: 'bg-green-50 dark:bg-green-950',
          text: 'text-green-600 dark:text-green-400',
          icon: 'text-green-500',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950',
          text: 'text-orange-600 dark:text-orange-400',
          icon: 'text-orange-500',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950',
          text: 'text-purple-600 dark:text-purple-400',
          icon: 'text-purple-500',
        };
      case 'red':
        return {
          bg: 'bg-red-50 dark:bg-red-950',
          text: 'text-red-600 dark:text-red-400',
          icon: 'text-red-500',
        };
      case 'gray':
        return {
          bg: 'bg-gray-50 dark:bg-gray-950',
          text: 'text-gray-600 dark:text-gray-400',
          icon: 'text-gray-500',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-blue-500',
        };
    }
  };

  const colorClasses = getColorClasses(color);

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    } else if (val % 1 !== 0) {
      return val.toFixed(1);
    } else {
      return val.toLocaleString();
    }
  };

  const getTrendIcon = (trendValue?: number) => {
    if (trendValue === undefined) return null;
    
    if (trendValue > 0) {
      return <ArrowUp className="h-4 w-4" />;
    } else if (trendValue < 0) {
      return <ArrowDown className="h-4 w-4" />;
    } else {
      return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trendValue?: number) => {
    if (trendValue === undefined) return 'text-muted-foreground';
    
    if (trendValue > 0) {
      return 'text-green-600 dark:text-green-400';
    } else if (trendValue < 0) {
      return 'text-red-600 dark:text-red-400';
    } else {
      return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn('p-2 rounded-lg', colorClasses.bg)}>
            <div className={cn('h-4 w-4', colorClasses.icon)}>
              {icon}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn('text-2xl font-bold', colorClasses.text)}>
              {formatValue(value)}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <div className={cn('flex items-center gap-1', getTrendColor(trend))}>
                {getTrendIcon(trend)}
                <span className="text-sm font-medium">
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
