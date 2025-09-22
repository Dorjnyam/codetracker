'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Layout, 
  Plus, 
  Trash2, 
  Settings, 
  Eye, 
  Save, 
  Download,
  Upload,
  Copy,
  Move,
  Resize,
  Grid3X3,
  BarChart3,
  Users,
  Activity,
  Target,
  Award,
  Clock,
  TrendingUp,
  Calendar,
  Zap,
  Globe,
  Database,
  Shield,
  Star,
  Heart,
  MessageSquare,
  FileText,
  Image,
  Monitor
} from 'lucide-react';
import { 
  DashboardConfig, 
  DashboardWidget, 
  DashboardLayout as DashboardLayoutType,
  GridItem,
  ChartType,
  WidgetType,
  DataSource
} from '@/types/analytics';
import { cn } from '@/lib/utils';

interface DashboardBuilderProps {
  className?: string;
}

export function DashboardBuilder({ className }: DashboardBuilderProps) {
  const [dashboard, setDashboard] = useState<Partial<DashboardConfig>>({
    name: 'My Custom Dashboard',
    description: 'A personalized analytics dashboard',
    layout: {
      columns: 12,
      rows: 8,
      grid: [],
    },
    widgets: [],
    filters: [],
    refreshInterval: 30,
    isDefault: false,
    isPublic: false,
  });

  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  // Available widget types
  const widgetTypes: { type: WidgetType; label: string; icon: React.ReactNode; description: string }[] = [
    { type: 'CHART', label: 'Chart', icon: <BarChart3 className="h-4 w-4" />, description: 'Interactive charts and graphs' },
    { type: 'METRIC', label: 'Metric', icon: <Target className="h-4 w-4" />, description: 'Key performance indicators' },
    { type: 'TABLE', label: 'Table', icon: <Grid3X3 className="h-4 w-4" />, description: 'Data tables and lists' },
    { type: 'TEXT', label: 'Text', icon: <FileText className="h-4 w-4" />, description: 'Text content and notes' },
    { type: 'IMAGE', label: 'Image', icon: <Image className="h-4 w-4" />, description: 'Images and media' },
    { type: 'IFRAME', label: 'Embed', icon: <Monitor className="h-4 w-4" />, description: 'Embedded content' },
  ];

  // Available chart types
  const chartTypes: { type: ChartType; label: string }[] = [
    { type: 'LINE', label: 'Line Chart' },
    { type: 'BAR', label: 'Bar Chart' },
    { type: 'PIE', label: 'Pie Chart' },
    { type: 'RADAR', label: 'Radar Chart' },
    { type: 'HEATMAP', label: 'Heatmap' },
    { type: 'SCATTER', label: 'Scatter Plot' },
    { type: 'AREA', label: 'Area Chart' },
    { type: 'DONUT', label: 'Donut Chart' },
  ];

  const addWidget = (type: WidgetType) => {
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      type,
      title: `New ${type}`,
      description: '',
      config: {
        chartType: type === 'CHART' ? 'LINE' : undefined,
        showLegend: true,
        showTooltips: true,
        showDataLabels: false,
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        size: 'MEDIUM',
        position: 'CENTER',
      },
      dataSource: {
        type: 'STATIC',
        parameters: {},
        cache: true,
        cacheDuration: 300,
      },
      refreshInterval: 30,
      filters: [],
      actions: [],
    };

    setDashboard(prev => ({
      ...prev,
      widgets: [...(prev.widgets || []), newWidget],
    }));

    setSelectedWidget(newWidget.id);
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets?.map(widget => 
        widget.id === widgetId ? { ...widget, ...updates } : widget
      ),
    }));
  };

  const removeWidget = (widgetId: string) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets?.filter(widget => widget.id !== widgetId),
      layout: {
        ...prev.layout!,
        grid: prev.layout?.grid?.filter(item => item.widgetId !== widgetId) || [],
      },
    }));
    setSelectedWidget(null);
  };

  const addGridItem = (widgetId: string, x: number, y: number, width: number, height: number) => {
    const newGridItem: GridItem = {
      id: `grid_${Date.now()}`,
      widgetId,
      x,
      y,
      width,
      height,
      minWidth: 2,
      minHeight: 2,
      maxWidth: 12,
      maxHeight: 8,
    };

    setDashboard(prev => ({
      ...prev,
      layout: {
        ...prev.layout!,
        grid: [...(prev.layout?.grid || []), newGridItem],
      },
    }));
  };

  const updateGridItem = (gridItemId: string, updates: Partial<GridItem>) => {
    setDashboard(prev => ({
      ...prev,
      layout: {
        ...prev.layout!,
        grid: prev.layout?.grid?.map(item => 
          item.id === gridItemId ? { ...item, ...updates } : item
        ) || [],
      },
    }));
  };

  const removeGridItem = (gridItemId: string) => {
    setDashboard(prev => ({
      ...prev,
      layout: {
        ...prev.layout!,
        grid: prev.layout?.grid?.filter(item => item.id !== gridItemId) || [],
      },
    }));
  };

  const handleSaveDashboard = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dashboard saved:', dashboard);
      // Show success message
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      // Show error message
    }
  };

  const handleExportDashboard = () => {
    const dataStr = JSON.stringify(dashboard, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dashboard.name || 'dashboard'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDashboard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedDashboard = JSON.parse(e.target?.result as string);
          setDashboard(importedDashboard);
        } catch (error) {
          console.error('Failed to import dashboard:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const getWidgetIcon = (type: WidgetType) => {
    const widgetType = widgetTypes.find(wt => wt.type === type);
    return widgetType?.icon || <BarChart3 className="h-4 w-4" />;
  };

  const selectedWidgetData = dashboard.widgets?.find(w => w.id === selectedWidget);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Builder</h2>
          <p className="text-muted-foreground">
            Create and customize your analytics dashboard
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            onChange={handleImportDashboard}
            className="hidden"
            id="import-dashboard"
          />
          <Button variant="outline" size="sm" onClick={() => document.getElementById('import-dashboard')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportDashboard}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button size="sm" onClick={handleSaveDashboard}>
            <Save className="h-4 w-4 mr-2" />
            Save Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Widget Library */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Widgets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {widgetTypes.map((widgetType) => (
                <Button
                  key={widgetType.type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addWidget(widgetType.type)}
                >
                  {widgetType.icon}
                  <div className="ml-2 text-left">
                    <div className="font-medium">{widgetType.label}</div>
                    <div className="text-xs text-muted-foreground">{widgetType.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Dashboard Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dashboard Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-name">Name</Label>
                <Input
                  id="dashboard-name"
                  value={dashboard.name}
                  onChange={(e) => setDashboard(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dashboard name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dashboard-description">Description</Label>
                <Textarea
                  id="dashboard-description"
                  value={dashboard.description}
                  onChange={(e) => setDashboard(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Dashboard description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  value={dashboard.refreshInterval}
                  onChange={(e) => setDashboard(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                  min="10"
                  max="3600"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is-default"
                    checked={dashboard.isDefault}
                    onCheckedChange={(checked) => setDashboard(prev => ({ ...prev, isDefault: !!checked }))}
                  />
                  <Label htmlFor="is-default">Set as default dashboard</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="is-public"
                    checked={dashboard.isPublic}
                    onCheckedChange={(checked) => setDashboard(prev => ({ ...prev, isPublic: !!checked }))}
                  />
                  <Label htmlFor="is-public">Make dashboard public</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Dashboard Canvas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={gridRef}
                className="relative min-h-[600px] border-2 border-dashed border-muted-foreground/25 rounded-lg p-4"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${dashboard.layout?.columns || 12}, 1fr)`,
                  gridTemplateRows: `repeat(${dashboard.layout?.rows || 8}, 1fr)`,
                  gap: '8px',
                }}
              >
                {dashboard.layout?.grid?.map((gridItem) => {
                  const widget = dashboard.widgets?.find(w => w.id === gridItem.widgetId);
                  if (!widget) return null;

                  return (
                    <div
                      key={gridItem.id}
                      className={cn(
                        'border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow',
                        selectedWidget === widget.id ? 'ring-2 ring-primary' : 'border-muted-foreground/25'
                      )}
                      style={{
                        gridColumn: `${gridItem.x} / span ${gridItem.width}`,
                        gridRow: `${gridItem.y} / span ${gridItem.height}`,
                      }}
                      onClick={() => setSelectedWidget(widget.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getWidgetIcon(widget.type)}
                          <span className="font-medium text-sm">{widget.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWidget(widget.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {widget.type} • {gridItem.width}×{gridItem.height}
                      </div>
                      
                      {/* Widget Preview */}
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-center">
                        {widget.type === 'CHART' && '📊 Chart Preview'}
                        {widget.type === 'METRIC' && '📈 Metric Preview'}
                        {widget.type === 'TABLE' && '📋 Table Preview'}
                        {widget.type === 'TEXT' && '📝 Text Preview'}
                        {widget.type === 'IMAGE' && '🖼️ Image Preview'}
                        {widget.type === 'IFRAME' && '🖥️ Embed Preview'}
                      </div>
                    </div>
                  );
                })}
                
                {/* Empty State */}
                {dashboard.layout?.grid?.length === 0 && (
                  <div className="col-span-full row-span-full flex items-center justify-center text-center">
                    <div>
                      <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No widgets added yet</p>
                      <p className="text-sm text-muted-foreground">Add widgets from the library to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Widget Properties */}
        <div className="lg:col-span-1">
          {selectedWidgetData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Widget Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widget-title">Title</Label>
                  <Input
                    id="widget-title"
                    value={selectedWidgetData.title}
                    onChange={(e) => updateWidget(selectedWidgetData.id, { title: e.target.value })}
                    placeholder="Widget title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="widget-description">Description</Label>
                  <Textarea
                    id="widget-description"
                    value={selectedWidgetData.description}
                    onChange={(e) => updateWidget(selectedWidgetData.id, { description: e.target.value })}
                    placeholder="Widget description"
                    rows={2}
                  />
                </div>
                
                {selectedWidgetData.type === 'CHART' && (
                  <div className="space-y-2">
                    <Label htmlFor="chart-type">Chart Type</Label>
                    <Select
                      value={selectedWidgetData.config?.chartType}
                      onValueChange={(value) => updateWidget(selectedWidgetData.id, {
                        config: { ...selectedWidgetData.config, chartType: value as ChartType }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        {chartTypes.map((chartType) => (
                          <SelectItem key={chartType.type} value={chartType.type}>
                            {chartType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="widget-size">Size</Label>
                  <Select
                    value={selectedWidgetData.config?.size}
                    onValueChange={(value) => updateWidget(selectedWidgetData.id, {
                      config: { ...selectedWidgetData.config, size: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    value={selectedWidgetData.refreshInterval}
                    onChange={(e) => updateWidget(selectedWidgetData.id, { refreshInterval: parseInt(e.target.value) })}
                    min="10"
                    max="3600"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="show-legend"
                      checked={selectedWidgetData.config?.showLegend}
                      onCheckedChange={(checked) => updateWidget(selectedWidgetData.id, {
                        config: { ...selectedWidgetData.config, showLegend: !!checked }
                      })}
                    />
                    <Label htmlFor="show-legend">Show Legend</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="show-tooltips"
                      checked={selectedWidgetData.config?.showTooltips}
                      onCheckedChange={(checked) => updateWidget(selectedWidgetData.id, {
                        config: { ...selectedWidgetData.config, showTooltips: !!checked }
                      })}
                    />
                    <Label htmlFor="show-tooltips">Show Tooltips</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="show-data-labels"
                      checked={selectedWidgetData.config?.showDataLabels}
                      onCheckedChange={(checked) => updateWidget(selectedWidgetData.id, {
                        config: { ...selectedWidgetData.config, showDataLabels: !!checked }
                      })}
                    />
                    <Label htmlFor="show-data-labels">Show Data Labels</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select a widget to edit its properties</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
