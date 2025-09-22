'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Palette, 
  Eraser, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Undo, 
  Redo, 
  Download, 
  Upload,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Share,
  MoreHorizontal,
  Pen,
  Highlighter,
  MousePointer,
  Move,
  Crop
} from 'lucide-react';
import { 
  WhiteboardDrawing, 
  DrawingPoint, 
  CollaborationUser 
} from '@/types/collaboration';
import { cn } from '@/lib/utils';

interface WhiteboardProps {
  drawings: WhiteboardDrawing[];
  participants: CollaborationUser[];
  currentUser: CollaborationUser;
  onDrawingChange: (drawing: WhiteboardDrawing) => void;
  onDrawingDelete: (drawingId: string) => void;
  onClearAll: () => void;
  onSave: () => void;
  onExport: () => void;
  className?: string;
}

type DrawingTool = 'PEN' | 'HIGHLIGHTER' | 'ERASER' | 'SHAPE' | 'TEXT' | 'SELECT' | 'MOVE' | 'CROP';
type ShapeType = 'RECTANGLE' | 'CIRCLE' | 'LINE' | 'ARROW';

const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'
];

const STROKE_WIDTHS = [1, 2, 4, 8, 12, 16, 20];

export function Whiteboard({
  drawings,
  participants,
  currentUser,
  onDrawingChange,
  onDrawingDelete,
  onClearAll,
  onSave,
  onExport,
  className,
}: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('PEN');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(4);
  const [currentShape, setCurrentShape] = useState<ShapeType>('RECTANGLE');
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState<WhiteboardDrawing[]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardDrawing[]>([]);
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Redraw all drawings
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Redraw canvas when drawings change
  useEffect(() => {
    redrawCanvas();
  }, [drawings, zoom, panOffset]);

  // Redraw the entire canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Draw all drawings
    drawings.forEach(drawing => {
      drawDrawing(ctx, drawing);
    });

    ctx.restore();
  }, [drawings, zoom, panOffset]);

  // Draw a single drawing
  const drawDrawing = (ctx: CanvasRenderingContext2D, drawing: WhiteboardDrawing) => {
    ctx.strokeStyle = drawing.color;
    ctx.lineWidth = drawing.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (drawing.tool) {
      case 'PEN':
      case 'HIGHLIGHTER':
        drawPenPath(ctx, drawing);
        break;
      case 'ERASER':
        drawEraserPath(ctx, drawing);
        break;
      case 'SHAPE':
        drawShape(ctx, drawing);
        break;
      case 'TEXT':
        drawText(ctx, drawing);
        break;
    }
  };

  // Draw pen/highlighter path
  const drawPenPath = (ctx: CanvasRenderingContext2D, drawing: WhiteboardDrawing) => {
    if (drawing.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(drawing.points[0].x, drawing.points[0].y);

    for (let i = 1; i < drawing.points.length; i++) {
      const point = drawing.points[i];
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();

    // Add glow effect for highlighter
    if (drawing.tool === 'HIGHLIGHTER') {
      ctx.shadowColor = drawing.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  // Draw eraser path
  const drawEraserPath = (ctx: CanvasRenderingContext2D, drawing: WhiteboardDrawing) => {
    if (drawing.points.length < 2) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = drawing.strokeWidth;
    ctx.beginPath();
    ctx.moveTo(drawing.points[0].x, drawing.points[0].y);

    for (let i = 1; i < drawing.points.length; i++) {
      const point = drawing.points[i];
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  };

  // Draw shape
  const drawShape = (ctx: CanvasRenderingContext2D, drawing: WhiteboardDrawing) => {
    if (drawing.points.length < 2) return;

    const start = drawing.points[0];
    const end = drawing.points[drawing.points.length - 1];

    ctx.beginPath();

    switch (drawing.shape) {
      case 'RECTANGLE':
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;
      case 'CIRCLE':
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        break;
      case 'LINE':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        break;
      case 'ARROW':
        drawArrow(ctx, start, end);
        break;
    }

    ctx.stroke();
  };

  // Draw arrow
  const drawArrow = (ctx: CanvasRenderingContext2D, start: DrawingPoint, end: DrawingPoint) => {
    const headLength = 20;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    // Draw line
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);

    // Draw arrowhead
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - Math.PI / 6),
      end.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + Math.PI / 6),
      end.y - headLength * Math.sin(angle + Math.PI / 6)
    );
  };

  // Draw text
  const drawText = (ctx: CanvasRenderingContext2D, drawing: WhiteboardDrawing) => {
    if (!drawing.text || drawing.points.length === 0) return;

    const point = drawing.points[0];
    ctx.font = `${drawing.fontSize || 16}px Arial`;
    ctx.fillStyle = drawing.color;
    ctx.fillText(drawing.text, point.x, point.y);
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    if (currentTool === 'SELECT' || currentTool === 'MOVE') {
      // Handle selection/move
      const drawing = drawings.find(d => isPointInDrawing({ x, y }, d));
      if (drawing) {
        setSelectedDrawing(drawing.id);
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    if (currentTool === 'CROP') {
      // Handle crop tool
      return;
    }

    if (currentTool === 'TEXT') {
      // Handle text input
      setIsTextMode(true);
      setTextPosition({ x, y });
      return;
    }

    // Start drawing
    setIsDrawing(true);
    
    const newDrawing: WhiteboardDrawing = {
      id: `drawing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: '', // Will be set by parent
      userId: currentUser.id,
      tool: currentTool,
      color: currentColor,
      strokeWidth: currentStrokeWidth,
      points: [{ x, y, timestamp: new Date() }],
      shape: currentTool === 'SHAPE' ? currentShape : undefined,
      timestamp: new Date(),
    };

    // Add to undo stack
    setUndoStack(prev => [...prev, newDrawing]);
    setRedoStack([]);

    onDrawingChange(newDrawing);
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / zoom;
    const y = (e.clientY - rect.top - panOffset.y) / zoom;

    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isDrawing) {
      const newPoint: DrawingPoint = { x, y, timestamp: new Date() };
      
      // Update the last drawing
      const lastDrawing = drawings[drawings.length - 1];
      if (lastDrawing && lastDrawing.userId === currentUser.id) {
        const updatedDrawing = {
          ...lastDrawing,
          points: [...lastDrawing.points, newPoint],
        };
        onDrawingChange(updatedDrawing);
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
  };

  // Handle text input
  const handleTextSubmit = () => {
    if (!textInput.trim() || !textPosition) return;

    const newDrawing: WhiteboardDrawing = {
      id: `drawing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: '', // Will be set by parent
      userId: currentUser.id,
      tool: 'TEXT',
      color: currentColor,
      strokeWidth: currentStrokeWidth,
      points: [textPosition],
      text: textInput,
      fontSize: 16,
      timestamp: new Date(),
    };

    onDrawingChange(newDrawing);
    setIsTextMode(false);
    setTextInput('');
    setTextPosition(null);
  };

  // Check if point is in drawing
  const isPointInDrawing = (point: { x: number; y: number }, drawing: WhiteboardDrawing): boolean => {
    // Simplified collision detection
    return drawing.points.some(p => 
      Math.abs(p.x - point.x) < 10 && Math.abs(p.y - point.y) < 10
    );
  };

  // Undo last action
  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastDrawing = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastDrawing]);
    onDrawingDelete(lastDrawing.id);
  };

  // Redo last action
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const lastDrawing = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastDrawing]);
    onDrawingChange(lastDrawing);
  };

  // Clear all drawings
  const handleClearAll = () => {
    onClearAll();
    setUndoStack([]);
    setRedoStack([]);
  };

  // Zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  // Zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  // Reset zoom
  const handleResetZoom = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Whiteboard
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b bg-muted/50">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1">
            <Button
              variant={currentTool === 'PEN' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('PEN')}
            >
              <Pen className="h-4 w-4" />
            </Button>
            
            <Button
              variant={currentTool === 'HIGHLIGHTER' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('HIGHLIGHTER')}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
            
            <Button
              variant={currentTool === 'ERASER' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('ERASER')}
            >
              <Eraser className="h-4 w-4" />
            </Button>
            
            <Button
              variant={currentTool === 'SHAPE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('SHAPE')}
            >
              <Square className="h-4 w-4" />
            </Button>
            
            <Button
              variant={currentTool === 'TEXT' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('TEXT')}
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-border" />

          {/* Selection Tools */}
          <div className="flex items-center gap-1">
            <Button
              variant={currentTool === 'SELECT' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('SELECT')}
            >
              <MousePointer className="h-4 w-4" />
            </Button>
            
            <Button
              variant={currentTool === 'MOVE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('MOVE')}
            >
              <Move className="h-4 w-4" />
            </Button>
            
            <Button
              variant={currentTool === 'CROP' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('CROP')}
            >
              <Crop className="h-4 w-4" />
            </Button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-border" />

          {/* Colors */}
          <div className="flex items-center gap-1">
            {COLORS.map(color => (
              <button
                key={color}
                className={cn(
                  'w-6 h-6 rounded border-2',
                  currentColor === color ? 'border-primary' : 'border-border'
                )}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-border" />

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            {STROKE_WIDTHS.map(width => (
              <Button
                key={width}
                variant={currentStrokeWidth === width ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStrokeWidth(width)}
                className="w-8 h-8 p-0"
              >
                <div
                  className="bg-current rounded-full"
                  style={{ width: width, height: width }}
                />
              </Button>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-border" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleResetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Text Input Modal */}
          {isTextMode && textPosition && (
            <div
              className="absolute bg-background border rounded p-2 shadow-lg"
              style={{
                left: textPosition.x * zoom + panOffset.x,
                top: textPosition.y * zoom + panOffset.y,
              }}
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTextSubmit();
                  }
                }}
                onBlur={handleTextSubmit}
                autoFocus
                className="border-none outline-none bg-transparent"
                placeholder="Enter text..."
              />
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 p-2 border-t bg-muted/50">
          <span className="text-sm font-medium">Active:</span>
          {participants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center gap-1 px-2 py-1 rounded bg-background border"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{participant.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
