'use client';

import React, { useState, useEffect } from 'react';
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
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Plus,
  Trash2,
  Settings,
  Eye,
  EyeOff,
  Clock,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  Filter,
  Search,
  MoreVertical,
  Mail,
  MessageSquare,
  Phone,
  Globe,
  Shield,
  Database,
  Server,
  Activity
} from 'lucide-react';
import { 
  Alert, 
  AlertRule, 
  AlertCondition, 
  AlertLevel,
  AlertAction
} from '@/types/analytics';
import { cn } from '@/lib/utils';

interface AlertCenterProps {
  className?: string;
}

export function AlertCenter({ className }: AlertCenterProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'settings'>('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<AlertLevel | 'ALL'>('ALL');
  const [showRead, setShowRead] = useState(true);

  // Mock alerts data
  const mockAlerts: Alert[] = [
    {
      id: 'alert1',
      title: 'High Error Rate Detected',
      message: 'Error rate has exceeded 5% threshold for the last 10 minutes',
      type: 'CRITICAL',
      category: 'SYSTEM',
      source: 'Error Monitoring',
      data: { errorRate: 5.2, threshold: 5.0, duration: '10 minutes' },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      acknowledged: false,
      actions: [
        { id: 'action1', name: 'View Details', type: 'NAVIGATE', config: { url: '/dashboard/errors' } },
        { id: 'action2', name: 'Acknowledge', type: 'ACKNOWLEDGE', config: {} },
      ],
    },
    {
      id: 'alert2',
      title: 'User Engagement Drop',
      message: 'User engagement has decreased by 15% compared to last week',
      type: 'WARNING',
      category: 'ENGAGEMENT',
      source: 'Analytics Engine',
      data: { currentEngagement: 78.5, previousEngagement: 92.3, change: -15.0 },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: true,
      acknowledged: true,
      actions: [
        { id: 'action3', name: 'View Analytics', type: 'NAVIGATE', config: { url: '/dashboard/analytics' } },
      ],
    },
    {
      id: 'alert3',
      title: 'New User Registration',
      message: '25 new users registered in the last hour',
      type: 'INFO',
      category: 'USER',
      source: 'User Management',
      data: { newUsers: 25, timeWindow: '1 hour' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      acknowledged: false,
      actions: [
        { id: 'action4', name: 'View Users', type: 'NAVIGATE', config: { url: '/dashboard/users' } },
      ],
    },
    {
      id: 'alert4',
      title: 'Performance Milestone',
      message: 'Platform achieved 99.9% uptime this month',
      type: 'SUCCESS',
      category: 'PERFORMANCE',
      source: 'Performance Monitor',
      data: { uptime: 99.9, period: 'monthly' },
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      acknowledged: false,
      actions: [
        { id: 'action5', name: 'View Performance', type: 'NAVIGATE', config: { url: '/dashboard/performance' } },
      ],
    },
  ];

  // Mock alert rules data
  const mockAlertRules: AlertRule[] = [
    {
      id: 'rule1',
      name: 'High Error Rate Alert',
      description: 'Alert when error rate exceeds 5%',
      condition: {
        metric: 'error_rate',
        operator: 'GREATER_THAN',
        value: 5.0,
        timeWindow: 10,
      },
      threshold: 5.0,
      frequency: 'IMMEDIATE',
      enabled: true,
      recipients: ['admin@example.com', 'devops@example.com'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'rule2',
      name: 'User Engagement Drop',
      description: 'Alert when user engagement drops significantly',
      condition: {
        metric: 'user_engagement',
        operator: 'LESS_THAN',
        value: 80.0,
        timeWindow: 60,
      },
      threshold: 80.0,
      frequency: 'HOURLY',
      enabled: true,
      recipients: ['product@example.com'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'rule3',
      name: 'New User Registration',
      description: 'Alert when many new users register',
      condition: {
        metric: 'new_users',
        operator: 'GREATER_THAN',
        value: 20,
        timeWindow: 60,
      },
      threshold: 20,
      frequency: 'HOURLY',
      enabled: false,
      recipients: ['marketing@example.com'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    setAlertRules(mockAlertRules);
  }, []);

  const getAlertIcon = (type: AlertLevel) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'INFO':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getAlertColor = (type: AlertLevel) => {
    switch (type) {
      case 'CRITICAL':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'WARNING':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'INFO':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      case 'SUCCESS':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SYSTEM':
        return <Server className="h-4 w-4" />;
      case 'PERFORMANCE':
        return <Activity className="h-4 w-4" />;
      case 'USER':
        return <Users className="h-4 w-4" />;
      case 'ENGAGEMENT':
        return <TrendingUp className="h-4 w-4" />;
      case 'SECURITY':
        return <Shield className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'ALL' || alert.type === filterLevel;
    const matchesRead = showRead || !alert.read;
    return matchesSearch && matchesLevel && matchesRead;
  });

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true, read: true } : alert
    ));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleToggleRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const criticalCount = alerts.filter(alert => alert.type === 'CRITICAL' && !alert.read).length;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alert Center</h2>
          <p className="text-muted-foreground">
            Monitor system alerts and notifications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive">
              {unreadCount} unread
            </Badge>
          )}
          {criticalCount > 0 && (
            <Badge variant="destructive">
              {criticalCount} critical
            </Badge>
          )}
          
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalCount}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.type === 'WARNING' && !a.read).length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.type === 'INFO' && !a.read).length}
                </div>
                <div className="text-sm text-muted-foreground">Info</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {alerts.filter(a => a.type === 'SUCCESS' && !a.read).length}
                </div>
                <div className="text-sm text-muted-foreground">Success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterLevel} onValueChange={(value) => setFilterLevel(value as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Levels</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-read"
                    checked={showRead}
                    onCheckedChange={(checked) => setShowRead(!!checked)}
                  />
                  <Label htmlFor="show-read">Show read</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={cn('transition-all', getAlertColor(alert.type))}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{alert.title}</h3>
                            {!alert.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            {alert.acknowledged && (
                              <Badge variant="outline" className="text-xs">
                                Acknowledged
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(alert.category)}
                            <span className="ml-1">{alert.category}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {alert.actions?.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (action.type === 'ACKNOWLEDGE') {
                                handleAcknowledge(alert.id);
                              } else if (action.type === 'NAVIGATE') {
                                // Handle navigation
                                console.log('Navigate to:', action.config.url);
                              }
                            }}
                          >
                            {action.name}
                          </Button>
                        ))}
                        
                        {!alert.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(alert.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Mark Read
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No alerts found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Alert Rules</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
          
          <div className="space-y-3">
            {alertRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Metric: {rule.condition.metric}</span>
                        <span>Operator: {rule.condition.operator}</span>
                        <span>Value: {rule.condition.value}</span>
                        <span>Frequency: {rule.frequency}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRule(rule.id)}
                      >
                        {rule.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="email-critical" defaultChecked />
                    <Label htmlFor="email-critical">Critical alerts</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="email-warning" defaultChecked />
                    <Label htmlFor="email-warning">Warning alerts</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="email-info" />
                    <Label htmlFor="email-info">Info alerts</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Push Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="push-critical" defaultChecked />
                    <Label htmlFor="push-critical">Critical alerts</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="push-warning" />
                    <Label htmlFor="push-warning">Warning alerts</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Quiet Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Input id="quiet-start" type="time" defaultValue="22:00" />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Input id="quiet-end" type="time" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
