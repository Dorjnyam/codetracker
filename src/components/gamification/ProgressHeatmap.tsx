'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityHeatmapEntry } from '@/lib/gamification/achievement-system';
import { cn } from '@/lib/utils';

interface ProgressHeatmapProps {
  data: ActivityHeatmapEntry[];
  className?: string;
  showTooltip?: boolean;
  colorScheme?: 'github' | 'fire' | 'ocean' | 'forest';
}

export function ProgressHeatmap({
  data,
  className,
  showTooltip = true,
  colorScheme = 'github',
}: ProgressHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate calendar data for the last year
  const generateCalendarData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const calendarData: { [key: string]: ActivityHeatmapEntry } = {};
    
    // Initialize all dates with zero activity
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      calendarData[dateStr] = {
        date: dateStr,
        count: 0,
        xp: 0,
        activities: [],
      };
    }
    
    // Fill in actual data
    data.forEach(entry => {
      calendarData[entry.date] = entry;
    });
    
    return calendarData;
  };

  const calendarData = generateCalendarData();
  const dates = Object.keys(calendarData).sort();

  // Get color intensity based on activity level
  const getColorIntensity = (count: number, maxCount: number) => {
    if (count === 0) return 0;
    if (maxCount === 0) return 0;
    
    const intensity = Math.min(count / maxCount, 1);
    return Math.ceil(intensity * 4); // 0-4 levels
  };

  const maxCount = Math.max(...Object.values(calendarData).map(d => d.count));

  // Color schemes
  const colorSchemes = {
    github: {
      0: 'bg-gray-100 dark:bg-gray-800',
      1: 'bg-green-200 dark:bg-green-900',
      2: 'bg-green-300 dark:bg-green-800',
      3: 'bg-green-400 dark:bg-green-700',
      4: 'bg-green-500 dark:bg-green-600',
    },
    fire: {
      0: 'bg-gray-100 dark:bg-gray-800',
      1: 'bg-orange-200 dark:bg-orange-900',
      2: 'bg-orange-300 dark:bg-orange-800',
      3: 'bg-orange-400 dark:bg-orange-700',
      4: 'bg-orange-500 dark:bg-orange-600',
    },
    ocean: {
      0: 'bg-gray-100 dark:bg-gray-800',
      1: 'bg-blue-200 dark:bg-blue-900',
      2: 'bg-blue-300 dark:bg-blue-800',
      3: 'bg-blue-400 dark:bg-blue-700',
      4: 'bg-blue-500 dark:bg-blue-600',
    },
    forest: {
      0: 'bg-gray-100 dark:bg-gray-800',
      1: 'bg-emerald-200 dark:bg-emerald-900',
      2: 'bg-emerald-300 dark:bg-emerald-800',
      3: 'bg-emerald-400 dark:bg-emerald-700',
      4: 'bg-emerald-500 dark:bg-emerald-600',
    },
  };

  const colors = colorSchemes[colorScheme];

  // Group dates by weeks
  const groupByWeeks = () => {
    const weeks: { [key: string]: string[] } = {};
    
    dates.forEach(date => {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(date);
    });
    
    return weeks;
  };

  const weeks = groupByWeeks();
  const weekKeys = Object.keys(weeks).sort();

  // Get month labels
  const getMonthLabels = () => {
    const labels: { [key: number]: string } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    weekKeys.forEach(weekKey => {
      const weekStart = new Date(weekKey);
      const month = weekStart.getMonth();
      const weekNumber = Math.floor(weekStart.getDate() / 7);
      
      if (!labels[month] || weekNumber === 0) {
        labels[month] = months[month];
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Coding Activity</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={cn(
                    'h-3 w-3 rounded-sm',
                    colors[level as keyof typeof colors]
                  )}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {/* Month labels */}
            <div className="flex flex-col justify-end pb-2 pr-2">
              {Object.entries(monthLabels).map(([month, label]) => (
                <div key={month} className="text-xs text-muted-foreground h-3 flex items-center">
                  {label}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="flex gap-1">
              {weekKeys.map(weekKey => (
                <div key={weekKey} className="flex flex-col gap-1">
                  {weeks[weekKey].map(date => {
                    const entry = calendarData[date];
                    const intensity = getColorIntensity(entry.count, maxCount);
                    const isHovered = hoveredCell === date;
                    const isSelected = selectedDate === date;
                    
                    return (
                      <div
                        key={date}
                        className={cn(
                          'h-3 w-3 rounded-sm cursor-pointer transition-all duration-200',
                          colors[intensity as keyof typeof colors],
                          isHovered && 'ring-2 ring-primary ring-offset-1',
                          isSelected && 'ring-2 ring-primary ring-offset-1 ring-opacity-50'
                        )}
                        onMouseEnter={() => setHoveredCell(date)}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                        title={showTooltip ? `${date}: ${entry.count} activities, ${entry.xp} XP` : undefined}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Selected date details */}
        {selectedDate && calendarData[selectedDate] && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Activities:</span>
                <span className="ml-2 font-medium">{calendarData[selectedDate].count}</span>
              </div>
              <div>
                <span className="text-muted-foreground">XP Earned:</span>
                <span className="ml-2 font-medium">{calendarData[selectedDate].xp}</span>
              </div>
            </div>
            {calendarData[selectedDate].activities.length > 0 && (
              <div className="mt-2">
                <span className="text-muted-foreground text-sm">Activities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {calendarData[selectedDate].activities.map((activity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {activity.replace(/_/g, ' ').toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.reduce((sum, entry) => sum + entry.count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Activities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.reduce((sum, entry) => sum + entry.xp, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.filter(entry => entry.count > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
