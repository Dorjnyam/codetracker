'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActivityHeatmapEntry } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface ActivityHeatmapProps {
  data: ActivityHeatmapEntry[];
  className?: string;
}

export function ActivityHeatmap({ data, className }: ActivityHeatmapProps) {
  // Group data by weeks
  const weeks = useMemo(() => {
    const weekGroups: ActivityHeatmapEntry[][] = [];
    let currentWeek: ActivityHeatmapEntry[] = [];
    
    data.forEach((entry, index) => {
      const date = new Date(entry.date);
      const dayOfWeek = date.getDay();
      
      currentWeek.push(entry);
      
      // Start new week on Sunday or at the end of data
      if (dayOfWeek === 0 || index === data.length - 1) {
        weekGroups.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weekGroups;
  }, [data]);

  // Get intensity color
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return 'bg-muted';
      case 1:
        return 'bg-green-100 dark:bg-green-900';
      case 2:
        return 'bg-green-200 dark:bg-green-800';
      case 3:
        return 'bg-green-300 dark:bg-green-700';
      case 4:
        return 'bg-green-400 dark:bg-green-600';
      default:
        return 'bg-muted';
    }
  };

  // Get day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Legend */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div
              key={intensity}
              className={cn(
                'w-3 h-3 rounded-sm',
                getIntensityColor(intensity)
              )}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-2">
          {dayLabels.map((day, index) => (
            <div
              key={day}
              className="h-3 text-xs text-muted-foreground flex items-center"
              style={{ 
                visibility: index % 2 === 0 ? 'visible' : 'hidden' // Show every other label
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((entry, dayIndex) => (
                <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'w-3 h-3 rounded-sm cursor-pointer transition-colors',
                          getIntensityColor(entry.intensity)
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <div className="font-medium">
                          {entry.count} {entry.count === 1 ? 'contribution' : 'contributions'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        {entry.activities.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {entry.activities.join(', ')}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {data.reduce((total, entry) => total + entry.count, 0)} total contributions
        </span>
        <span>
          {data.filter(entry => entry.count > 0).length} active days
        </span>
      </div>
    </div>
  );
}
