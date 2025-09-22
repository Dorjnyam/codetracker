'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Building, 
  FileText,
  Calendar,
  MessageSquare,
  AlertCircle,
  Shield
} from 'lucide-react';

interface RoleRequest {
  id: string;
  requestedRole: string;
  reason: string;
  institution: string;
  experience: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export default function AdminRoleRequestsPage() {
  const { data: session, status } = useSession();
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  // Check if user is admin
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Shield className="h-12 w-12 mx-auto text-red-500" />
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p className="text-muted-foreground">
                  You need administrator privileges to access this page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  useEffect(() => {
    fetchRoleRequests();
  }, [selectedTab]);

  const fetchRoleRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/role-requests?status=${selectedTab.toUpperCase()}`);
      
      if (response.ok) {
        const requests = await response.json();
        setRoleRequests(requests);
      } else {
        setError('Failed to fetch role requests');
      }
    } catch (error) {
      setError('Failed to fetch role requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingRequest(requestId);
    
    try {
      const response = await fetch('/api/admin/role-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action,
          adminNotes: adminNotes[requestId] || '',
        }),
      });

      if (response.ok) {
        // Refresh the requests
        await fetchRoleRequests();
        // Clear the admin notes for this request
        setAdminNotes(prev => ({ ...prev, [requestId]: '' }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to process request');
      }
    } catch (error) {
      setError('Failed to process request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredRequests = roleRequests.filter(req => 
    selectedTab === 'all' || req.status.toLowerCase() === selectedTab
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage teacher role requests from users
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="pending">
              <Clock className="h-4 w-4 mr-2" />
              Pending ({roleRequests.filter(r => r.status === 'PENDING').length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approved ({roleRequests.filter(r => r.status === 'APPROVED').length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <XCircle className="h-4 w-4 mr-2" />
              Rejected ({roleRequests.filter(r => r.status === 'REJECTED').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No {selectedTab} requests</h3>
                    <p className="text-muted-foreground">
                      There are no {selectedTab} role requests at the moment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <CardTitle className="text-lg">
                              {request.user.name}
                            </CardTitle>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {request.user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {request.institution}
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Request Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Teaching Experience</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.experience}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Motivation</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.reason}
                          </p>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <Label htmlFor={`notes-${request.id}`} className="text-sm font-medium">
                          Admin Notes
                        </Label>
                        <Textarea
                          id={`notes-${request.id}`}
                          placeholder="Add notes about this request..."
                          value={adminNotes[request.id] || ''}
                          onChange={(e) => setAdminNotes(prev => ({
                            ...prev,
                            [request.id]: e.target.value
                          }))}
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      {/* Action Buttons */}
                      {request.status === 'PENDING' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            disabled={processingRequest === request.id}
                            className="flex-1"
                          >
                            {processingRequest === request.id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            disabled={processingRequest === request.id}
                            variant="destructive"
                            className="flex-1"
                          >
                            {processingRequest === request.id ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      )}

                      {/* Review History */}
                      {request.reviewedAt && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Reviewed on {new Date(request.reviewedAt).toLocaleDateString()}
                          </div>
                          {request.adminNotes && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Admin Notes:</strong> {request.adminNotes}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
