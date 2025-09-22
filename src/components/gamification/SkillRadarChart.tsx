'use client';

import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillLevel } from '@/lib/gamification/achievement-system';
import { cn } from '@/lib/utils';

interface SkillRadarChartProps {
  skills: SkillLevel[];
  className?: string;
  size?: number;
  showLabels?: boolean;
  showGrid?: boolean;
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger';
}

export function SkillRadarChart({
  skills,
  className,
  size = 300,
  showLabels = true,
  showGrid = true,
  colorScheme = 'primary',
}: SkillRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Color schemes
  const colorSchemes = {
    primary: {
      fill: 'rgba(59, 130, 246, 0.2)',
      stroke: 'rgba(59, 130, 246, 0.8)',
      point: 'rgba(59, 130, 246, 1)',
      text: 'rgba(59, 130, 246, 1)',
    },
    success: {
      fill: 'rgba(34, 197, 94, 0.2)',
      stroke: 'rgba(34, 197, 94, 0.8)',
      point: 'rgba(34, 197, 94, 1)',
      text: 'rgba(34, 197, 94, 1)',
    },
    warning: {
      fill: 'rgba(245, 158, 11, 0.2)',
      stroke: 'rgba(245, 158, 11, 0.8)',
      point: 'rgba(245, 158, 11, 1)',
      text: 'rgba(245, 158, 11, 1)',
    },
    danger: {
      fill: 'rgba(239, 68, 68, 0.2)',
      stroke: 'rgba(239, 68, 68, 0.8)',
      point: 'rgba(239, 68, 68, 1)',
      text: 'rgba(239, 68, 68, 1)',
    },
  };

  const colors = colorSchemes[colorScheme];

  // Proficiency levels and their numeric values
  const proficiencyLevels = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
    EXPERT: 4,
  };

  // Normalize skill data for radar chart
  const normalizeSkills = (skills: SkillLevel[]) => {
    return skills.map(skill => ({
      ...skill,
      normalizedValue: proficiencyLevels[skill.proficiency] / 4, // 0-1 scale
    }));
  };

  const normalizedSkills = normalizeSkills(skills);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw grid circles
    if (showGrid) {
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 1; i <= 4; i++) {
        const gridRadius = (radius * i) / 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < normalizedSkills.length; i++) {
      const angle = (2 * Math.PI * i) / normalizedSkills.length;
      const x = centerX + radius * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(angle - Math.PI / 2);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw skill labels
    if (showLabels) {
      ctx.fillStyle = colors.text;
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      normalizedSkills.forEach((skill, i) => {
        const angle = (2 * Math.PI * i) / normalizedSkills.length;
        const labelRadius = radius + 20;
        const x = centerX + labelRadius * Math.cos(angle - Math.PI / 2);
        const y = centerY + labelRadius * Math.sin(angle - Math.PI / 2);
        
        ctx.fillText(skill.language.toUpperCase(), x, y);
      });
    }

    // Draw proficiency level labels
    if (showLabels) {
      ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const proficiencyLabels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
      proficiencyLabels.forEach((label, i) => {
        const labelRadius = (radius * (i + 1)) / 4;
        const x = centerX + labelRadius * Math.cos(-Math.PI / 2);
        const y = centerY + labelRadius * Math.sin(-Math.PI / 2);
        
        ctx.fillText(label, x - 60, y);
      });
    }

    // Draw skill area
    if (normalizedSkills.length > 0) {
      ctx.fillStyle = colors.fill;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      
      normalizedSkills.forEach((skill, i) => {
        const angle = (2 * Math.PI * i) / normalizedSkills.length;
        const skillRadius = radius * skill.normalizedValue;
        const x = centerX + skillRadius * Math.cos(angle - Math.PI / 2);
        const y = centerY + skillRadius * Math.sin(angle - Math.PI / 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw skill points
    ctx.fillStyle = colors.point;
    normalizedSkills.forEach((skill, i) => {
      const angle = (2 * Math.PI * i) / normalizedSkills.length;
      const skillRadius = radius * skill.normalizedValue;
      const x = centerX + skillRadius * Math.cos(angle - Math.PI / 2);
      const y = centerY + skillRadius * Math.sin(angle - Math.PI / 2);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [skills, size, showLabels, showGrid, colors]);

  // Get proficiency color
  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'BEGINNER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ADVANCED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'EXPERT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>Skill Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          {/* Radar Chart */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border rounded-lg"
              style={{ width: size, height: size }}
            />
          </div>
          
          {/* Skill Details */}
          <div className="w-full space-y-3">
            <h4 className="font-medium text-center">Skill Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {normalizedSkills.map((skill, index) => (
                <div
                  key={skill.language}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">
                      {skill.language.toUpperCase()}
                    </div>
                    <Badge className={getProficiencyColor(skill.proficiency)}>
                      {skill.proficiency}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Level {skill.level}</div>
                    <div>{skill.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="w-full">
            <h4 className="font-medium text-center mb-3">Proficiency Levels</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(proficiencyLevels).map(([level, value]) => (
                <div key={level} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${value / 4})`,
                    }}
                  />
                  <span className="text-sm text-muted-foreground">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
