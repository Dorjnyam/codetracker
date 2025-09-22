'use client';

import React, { useRef, useEffect } from 'react';
import { TimeSeriesData } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
  data: TimeSeriesData[];
  className?: string;
  title?: string;
}

export function ProgressChart({ data, className, title }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    // Find min and max values
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    // Set up drawing area
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw data line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1);
      const y = height - padding - (chartHeight * (point.value - minValue)) / valueRange;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1);
      const y = height - padding - (chartHeight * (point.value - minValue)) / valueRange;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange * i) / 5;
      const y = padding + (chartHeight * i) / 5;
      ctx.fillText(value.toFixed(0), padding - 10, y);
    }

    // X-axis labels (show first, middle, and last)
    if (data.length > 0) {
      const firstDate = data[0].timestamp;
      const middleDate = data[Math.floor(data.length / 2)].timestamp;
      const lastDate = data[data.length - 1].timestamp;

      const dates = [firstDate, middleDate, lastDate];
      const indices = [0, Math.floor(data.length / 2), data.length - 1];

      dates.forEach((date, i) => {
        const index = indices[i];
        const x = padding + (chartWidth * index) / (data.length - 1);
        ctx.fillText(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x, height - padding + 10);
      });
    }
  }, [data]);

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border rounded-lg"
          style={{ width: '400px', height: '200px' }}
        />
      </div>
      
      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium">
              {data.reduce((sum, d) => sum + d.value, 0) / data.length}
            </div>
            <div className="text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="font-medium">
              {Math.max(...data.map(d => d.value))}
            </div>
            <div className="text-muted-foreground">Peak</div>
          </div>
          <div className="text-center">
            <div className="font-medium">
              {Math.min(...data.map(d => d.value))}
            </div>
            <div className="text-muted-foreground">Low</div>
          </div>
        </div>
      )}
    </div>
  );
}
