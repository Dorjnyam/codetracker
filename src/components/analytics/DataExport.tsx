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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Upload, 
  Share, 
  Copy, 
  Link, 
  Mail,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Database,
  Image,
  Archive,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Users,
  Settings,
  Filter,
  RefreshCw,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  ExportRequest, 
  ShareRequest, 
  ExportFormat, 
  ExportOptions,
  SharePermission
} from '@/types/analytics';
import { cn } from '@/lib/utils';

interface DataExportProps {
  className?: string;
}

export function DataExport({ className }: DataExportProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'share' | 'history'>('export');
  const [exportRequest, setExportRequest] = useState<Partial<ExportRequest>>({
    type: 'DASHBOARD',
    format: 'PDF',
    filters: {},
    options: {
      includeCharts: true,
      includeData: true,
      includeMetadata: true,
      compression: false,
    },
    status: 'PENDING',
  });
  const [shareRequest, setShareRequest] = useState<Partial<ShareRequest>>({
    resourceType: 'DASHBOARD',
    resourceId: '',
    permissions: [],
    expiresAt: undefined,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportRequest[]>([]);
  const [shareHistory, setShareHistory] = useState<ShareRequest[]>([]);

  // Mock export history
  const mockExportHistory: ExportRequest[] = [
    {
      id: 'export1',
      type: 'DASHBOARD',
      format: 'PDF',
      filters: { dateRange: 'last30days', users: 'all' },
      options: { includeCharts: true, includeData: true, includeMetadata: true, compression: false },
      status: 'COMPLETED',
      downloadUrl: '/downloads/dashboard-report.pdf',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'export2',
      type: 'REPORT',
      format: 'EXCEL',
      filters: { dateRange: 'last7days', metrics: 'performance' },
      options: { includeCharts: false, includeData: true, includeMetadata: false, compression: true },
      status: 'COMPLETED',
      downloadUrl: '/downloads/performance-report.xlsx',
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 'export3',
      type: 'DATA',
      format: 'CSV',
      filters: { dateRange: 'last90days', users: 'active' },
      options: { includeCharts: false, includeData: true, includeMetadata: false, compression: true },
      status: 'PROCESSING',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  // Mock share history
  const mockShareHistory: ShareRequest[] = [
    {
      id: 'share1',
      resourceType: 'DASHBOARD',
      resourceId: 'dashboard-123',
      permissions: [
        { userId: 'user1', role: 'VIEWER', grantedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), grantedBy: 'admin' },
        { userId: 'user2', role: 'EDITOR', grantedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), grantedBy: 'admin' },
      ],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdBy: 'admin',
    },
    {
      id: 'share2',
      resourceType: 'REPORT',
      resourceId: 'report-456',
      permissions: [
        { userId: 'user3', role: 'VIEWER', grantedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), grantedBy: 'admin' },
      ],
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      createdBy: 'admin',
    },
  ];

  const exportTypes = [
    { value: 'DASHBOARD', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'REPORT', label: 'Report', icon: <FileText className="h-4 w-4" /> },
    { value: 'DATA', label: 'Raw Data', icon: <Database className="h-4 w-4" /> },
  ];

  const exportFormats = [
    { value: 'PDF', label: 'PDF Document', icon: <FileText className="h-4 w-4" /> },
    { value: 'EXCEL', label: 'Excel Spreadsheet', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'CSV', label: 'CSV Data', icon: <Database className="h-4 w-4" /> },
    { value: 'JSON', label: 'JSON Data', icon: <Archive className="h-4 w-4" /> },
    { value: 'PNG', label: 'PNG Image', icon: <Image className="h-4 w-4" /> },
    { value: 'SVG', label: 'SVG Vector', icon: <Image className="h-4 w-4" /> },
  ];

  const resourceTypes = [
    { value: 'DASHBOARD', label: 'Dashboard' },
    { value: 'REPORT', label: 'Report' },
    { value: 'ANALYTICS', label: 'Analytics' },
  ];

  const permissionRoles = [
    { value: 'VIEWER', label: 'Viewer', description: 'Can view the resource' },
    { value: 'EDITOR', label: 'Editor', description: 'Can view and edit the resource' },
    { value: 'ADMIN', label: 'Admin', description: 'Full access to the resource' },
  ];

  useEffect(() => {
    setExportHistory(mockExportHistory);
    setShareHistory(mockShareHistory);
  }, []);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newExport: ExportRequest = {
        id: `export_${Date.now()}`,
        ...exportRequest,
        status: 'COMPLETED',
        downloadUrl: `/downloads/${exportRequest.type?.toLowerCase()}-${Date.now()}.${exportRequest.format?.toLowerCase()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };
      
      setExportHistory(prev => [newExport, ...prev]);
      console.log('Export completed:', newExport);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      // Simulate share creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newShare: ShareRequest = {
        id: `share_${Date.now()}`,
        ...shareRequest,
        createdAt: new Date(),
        createdBy: 'current-user',
      };
      
      setShareHistory(prev => [newShare, ...prev]);
      console.log('Share created:', newShare);
    } catch (error) {
      console.error('Share creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (exportId: string) => {
    const exportItem = exportHistory.find(e => e.id === exportId);
    if (exportItem?.downloadUrl) {
      // Simulate download
      console.log('Downloading:', exportItem.downloadUrl);
    }
  };

  const handleCopyLink = (shareId: string) => {
    const shareItem = shareHistory.find(s => s.id === shareId);
    if (shareItem) {
      const shareUrl = `${window.location.origin}/shared/${shareItem.resourceType.toLowerCase()}/${shareItem.resourceId}`;
      navigator.clipboard.writeText(shareUrl);
      console.log('Link copied to clipboard:', shareUrl);
    }
  };

  const handleRevokeShare = (shareId: string) => {
    setShareHistory(prev => prev.filter(s => s.id !== shareId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'PROCESSING':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Export & Sharing</h2>
          <p className="text-muted-foreground">
            Export data and share resources with others
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="share">Share Resources</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-type">Export Type</Label>
                  <Select
                    value={exportRequest.type}
                    onValueChange={(value) => setExportRequest(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select export type" />
                    </SelectTrigger>
                    <SelectContent>
                      {exportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="export-format">Format</Label>
                  <Select
                    value={exportRequest.format}
                    onValueChange={(value) => setExportRequest(prev => ({ ...prev, format: value as ExportFormat }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center gap-2">
                            {format.icon}
                            {format.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select
                    value={exportRequest.filters?.dateRange as string}
                    onValueChange={(value) => setExportRequest(prev => ({
                      ...prev,
                      filters: { ...prev.filters, dateRange: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last90days">Last 90 days</SelectItem>
                      <SelectItem value="lastyear">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-filter">User Filter</Label>
                  <Select
                    value={exportRequest.filters?.users as string}
                    onValueChange={(value) => setExportRequest(prev => ({
                      ...prev,
                      filters: { ...prev.filters, users: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      <SelectItem value="active">Active users only</SelectItem>
                      <SelectItem value="students">Students only</SelectItem>
                      <SelectItem value="teachers">Teachers only</SelectItem>
                      <SelectItem value="admins">Admins only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-charts"
                      checked={exportRequest.options?.includeCharts}
                      onCheckedChange={(checked) => setExportRequest(prev => ({
                        ...prev,
                        options: { ...prev.options!, includeCharts: !!checked }
                      }))}
                    />
                    <Label htmlFor="include-charts">Include charts and visualizations</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-data"
                      checked={exportRequest.options?.includeData}
                      onCheckedChange={(checked) => setExportRequest(prev => ({
                        ...prev,
                        options: { ...prev.options!, includeData: !!checked }
                      }))}
                    />
                    <Label htmlFor="include-data">Include raw data</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="include-metadata"
                      checked={exportRequest.options?.includeMetadata}
                      onCheckedChange={(checked) => setExportRequest(prev => ({
                        ...prev,
                        options: { ...prev.options!, includeMetadata: !!checked }
                      }))}
                    />
                    <Label htmlFor="include-metadata">Include metadata and timestamps</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="compression"
                      checked={exportRequest.options?.compression}
                      onCheckedChange={(checked) => setExportRequest(prev => ({
                        ...prev,
                        options: { ...prev.options!, compression: !!checked }
                      }))}
                    />
                    <Label htmlFor="compression">Enable compression</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password Protection (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={exportRequest.options?.password || ''}
                    onChange={(e) => setExportRequest(prev => ({
                      ...prev,
                      options: { ...prev.options!, password: e.target.value }
                    }))}
                    placeholder="Enter password for protection"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="watermark">Watermark (Optional)</Label>
                  <Input
                    id="watermark"
                    value={exportRequest.options?.watermark || ''}
                    onChange={(e) => setExportRequest(prev => ({
                      ...prev,
                      options: { ...prev.options!, watermark: e.target.value }
                    }))}
                    placeholder="Enter watermark text"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Ready to Export</h3>
                  <p className="text-sm text-muted-foreground">
                    {exportRequest.type} as {exportRequest.format} format
                  </p>
                </div>
                
                <Button
                  onClick={handleExport}
                  disabled={loading || !exportRequest.type || !exportRequest.format}
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Generating...' : 'Export Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Share Tab */}
        <TabsContent value="share" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Share Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  Share Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-type">Resource Type</Label>
                  <Select
                    value={shareRequest.resourceType}
                    onValueChange={(value) => setShareRequest(prev => ({ ...prev, resourceType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resource-id">Resource ID</Label>
                  <Input
                    id="resource-id"
                    value={shareRequest.resourceId}
                    onChange={(e) => setShareRequest(prev => ({ ...prev, resourceId: e.target.value }))}
                    placeholder="Enter resource ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expires-at">Expires At (Optional)</Label>
                  <Input
                    id="expires-at"
                    type="datetime-local"
                    value={shareRequest.expiresAt ? new Date(shareRequest.expiresAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setShareRequest(prev => ({
                      ...prev,
                      expiresAt: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="share-password">Password Protection (Optional)</Label>
                  <Input
                    id="share-password"
                    type="password"
                    value={shareRequest.password || ''}
                    onChange={(e) => setShareRequest(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password for protection"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {shareRequest.permissions?.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{permission.userId}</div>
                        <div className="text-sm text-muted-foreground">
                          {permissionRoles.find(r => r.value === permission.role)?.description}
                        </div>
                      </div>
                      <Badge variant="outline">{permission.role}</Badge>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input placeholder="User ID" />
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {permissionRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Share Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Ready to Share</h3>
                  <p className="text-sm text-muted-foreground">
                    {shareRequest.resourceType} with {shareRequest.permissions?.length || 0} users
                  </p>
                </div>
                
                <Button
                  onClick={handleShare}
                  disabled={loading || !shareRequest.resourceType || !shareRequest.resourceId}
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Share className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Creating...' : 'Create Share'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Tabs value="export-history" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export-history">Export History</TabsTrigger>
              <TabsTrigger value="share-history">Share History</TabsTrigger>
            </TabsList>

            {/* Export History */}
            <TabsContent value="export-history" className="space-y-4">
              <div className="space-y-3">
                {exportHistory.map((exportItem) => (
                  <Card key={exportItem.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(exportItem.status)}
                            <Badge className={getStatusColor(exportItem.status)}>
                              {exportItem.status}
                            </Badge>
                          </div>
                          
                          <div>
                            <div className="font-medium">
                              {exportItem.type} Export
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exportItem.format} • {exportItem.createdAt.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {exportItem.status === 'COMPLETED' && exportItem.downloadUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(exportItem.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                          
                          {exportItem.expiresAt && (
                            <div className="text-xs text-muted-foreground">
                              Expires: {exportItem.expiresAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Share History */}
            <TabsContent value="share-history" className="space-y-4">
              <div className="space-y-3">
                {shareHistory.map((shareItem) => (
                  <Card key={shareItem.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <Badge variant="outline">ACTIVE</Badge>
                          </div>
                          
                          <div>
                            <div className="font-medium">
                              {shareItem.resourceType} Share
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {shareItem.permissions.length} users • {shareItem.createdAt.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(shareItem.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeShare(shareItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          {shareItem.expiresAt && (
                            <div className="text-xs text-muted-foreground">
                              Expires: {shareItem.expiresAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
