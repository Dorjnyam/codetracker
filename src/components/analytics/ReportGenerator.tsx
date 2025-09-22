'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  Settings,
  Plus,
  Trash2,
  Eye,
  Share,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  Report, 
  ReportTemplate, 
  ReportFormat, 
  ReportSchedule,
  ReportFilter
} from '@/types/analytics';
import { cn } from '@/lib/utils';

interface ReportGeneratorProps {
  className?: string;
}

export function ReportGenerator({ className }: ReportGeneratorProps) {
  const [report, setReport] = useState<Partial<Report>>({
    name: '',
    description: '',
    type: 'ANALYTICS',
    format: 'PDF',
    template: {
      id: 'default',
      name: 'Default Template',
      sections: [],
      styling: {
        theme: 'LIGHT',
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        fonts: {
          primary: 'Inter',
          secondary: 'Inter',
        },
        layout: 'SINGLE_COLUMN',
      },
    },
    schedule: {
      frequency: 'MONTHLY',
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: '09:00',
      timezone: 'UTC',
      enabled: false,
    },
    recipients: [],
    filters: [],
    status: 'DRAFT',
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newFilter, setNewFilter] = useState<Partial<ReportFilter>>({
    name: '',
    type: 'DATE_RANGE',
    required: false,
  });

  const reportTypes = [
    { value: 'ANALYTICS', label: 'Analytics Report' },
    { value: 'PERFORMANCE', label: 'Performance Report' },
    { value: 'ENGAGEMENT', label: 'Engagement Report' },
    { value: 'CUSTOM', label: 'Custom Report' },
  ];

  const reportFormats = [
    { value: 'PDF', label: 'PDF Document' },
    { value: 'EXCEL', label: 'Excel Spreadsheet' },
    { value: 'CSV', label: 'CSV Data' },
    { value: 'JSON', label: 'JSON Data' },
  ];

  const scheduleFrequencies = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'YEARLY', label: 'Yearly' },
  ];

  const filterTypes = [
    { value: 'DATE_RANGE', label: 'Date Range' },
    { value: 'SELECT', label: 'Single Select' },
    { value: 'MULTI_SELECT', label: 'Multi Select' },
    { value: 'NUMBER_RANGE', label: 'Number Range' },
  ];

  const handleSaveReport = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Report saved:', report);
      // Show success message
    } catch (error) {
      console.error('Failed to save report:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Report generated:', report);
      // Show success message and download link
    } catch (error) {
      console.error('Failed to generate report:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipient = () => {
    if (newRecipient.trim()) {
      setReport(prev => ({
        ...prev,
        recipients: [...(prev.recipients || []), newRecipient.trim()],
      }));
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (index: number) => {
    setReport(prev => ({
      ...prev,
      recipients: prev.recipients?.filter((_, i) => i !== index),
    }));
  };

  const handleAddFilter = () => {
    if (newFilter.name?.trim()) {
      setReport(prev => ({
        ...prev,
        filters: [...(prev.filters || []), {
          id: `filter_${Date.now()}`,
          name: newFilter.name!,
          type: newFilter.type!,
          value: null,
          required: newFilter.required || false,
        }],
      }));
      setNewFilter({
        name: '',
        type: 'DATE_RANGE',
        required: false,
      });
    }
  };

  const handleRemoveFilter = (index: number) => {
    setReport(prev => ({
      ...prev,
      filters: prev.filters?.filter((_, i) => i !== index),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'GENERATING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Report Generator</h2>
          <p className="text-muted-foreground">
            Create and schedule custom analytics reports
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSaveReport}
            disabled={loading}
          >
            <Settings className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          <Button
            onClick={handleGenerateReport}
            disabled={loading || !report.name}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  value={report.name}
                  onChange={(e) => setReport(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter report name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea
                  id="report-description"
                  value={report.description}
                  onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter report description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select
                    value={report.type}
                    onValueChange={(value) => setReport(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-format">Format</Label>
                  <Select
                    value={report.format}
                    onValueChange={(value) => setReport(prev => ({ ...prev, format: value as ReportFormat }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.filters?.map((filter, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{filter.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {filter.type} • {filter.required ? 'Required' : 'Optional'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Filter name"
                    value={newFilter.name}
                    onChange={(e) => setNewFilter(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Select
                    value={newFilter.type}
                    onValueChange={(value) => setNewFilter(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`required-${index}`}
                      checked={newFilter.required}
                      onCheckedChange={(checked) => setNewFilter(prev => ({ ...prev, required: !!checked }))}
                    />
                    <Label htmlFor={`required-${index}`} className="text-sm">
                      Required
                    </Label>
                  </div>
                </div>
                <Button onClick={handleAddFilter} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="schedule-enabled"
                  checked={report.schedule?.enabled}
                  onCheckedChange={(checked) => setReport(prev => ({
                    ...prev,
                    schedule: { ...prev.schedule!, enabled: !!checked }
                  }))}
                />
                <Label htmlFor="schedule-enabled">Enable scheduled reports</Label>
              </div>
              
              {report.schedule?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-frequency">Frequency</Label>
                    <Select
                      value={report.schedule?.frequency}
                      onValueChange={(value) => setReport(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule!, frequency: value as any }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {scheduleFrequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={report.schedule?.time}
                      onChange={(e) => setReport(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule!, time: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recipients and Status */}
        <div className="space-y-6">
          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.recipients?.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{recipient}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveRecipient(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                />
                <Button onClick={handleAddRecipient} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Report Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusColor(report.status || 'DRAFT')}>
                  {report.status || 'DRAFT'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Modified</span>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
              
              {report.schedule?.enabled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Run</span>
                  <span className="text-sm">
                    {report.schedule.frequency === 'DAILY' ? 'Tomorrow' :
                     report.schedule.frequency === 'WEEKLY' ? 'Next week' :
                     report.schedule.frequency === 'MONTHLY' ? 'Next month' : 'Next quarter'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Share className="h-4 w-4 mr-2" />
                Share Report
              </Button>
              
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Preview Report
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
