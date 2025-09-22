'use client';

import React, { useRef, useEffect } from 'react';
import { SkillProgress } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface SkillRadarChartProps {
  skills: SkillProgress[];
  className?: string;
}

export function SkillRadarChart({ skills, className }: SkillRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;

    // Draw background circles
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < skills.length; i++) {
      const angle = (2 * Math.PI * i) / skills.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw skill labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    skills.forEach((skill, i) => {
      const angle = (2 * Math.PI * i) / skills.length - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillText(skill.skill, x, y);
    });

    // Draw skill data
    if (skills.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      skills.forEach((skill, i) => {
        const angle = (2 * Math.PI * i) / skills.length - Math.PI / 2;
        const skillRadius = (radius * skill.proficiency) / 100;
        const x = centerX + Math.cos(angle) * skillRadius;
        const y = centerY + Math.sin(angle) * skillRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw data points
      ctx.fillStyle = '#3b82f6';
      skills.forEach((skill, i) => {
        const angle = (2 * Math.PI * i) / skills.length - Math.PI / 2;
        const skillRadius = (radius * skill.proficiency) / 100;
        const x = centerX + Math.cos(angle) * skillRadius;
        const y = centerY + Math.sin(angle) * skillRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [skills]);

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <canvas
        ref={canvasRef}
        className="border rounded-lg"
        style={{ width: '200px', height: '200px' }}
      />
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">
              {skill.skill}: {skill.proficiency}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
