'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Building, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Send
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
}

export function RoleRequestForm() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    reason: '',
    institution: '',
    experience: '',
  });

  // Fetch existing role requests
  React.useEffect(() => {
    const fetchRoleRequests = async () => {
      try {
        const response = await fetch('/api/user/role-request');
        if (response.ok) {
          const requests = await response.json();
          setRoleRequests(requests);
          
          // Check if there's a pending request
          const pendingRequest = requests.find((req: RoleRequest) => req.status === 'PENDING');
          if (pendingRequest) {
            setShowForm(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch role requests:', error);
      }
    };

    fetchRoleRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/user/role-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setShowForm(false);
        // Refresh role requests
        const requests = await fetch('/api/user/role-request').then(res => res.json());
        setRoleRequests(requests);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit role request');
      }
    } catch (error) {
      setError('Failed to submit role request');
    } finally {
      setIsSubmitting(false);
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

  // Don't show the form if user is already a teacher or admin
  if (session?.user?.role === 'TEACHER' || session?.user?.role === 'ADMIN') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Teacher Status
          </CardTitle>
          <CardDescription>
            You already have teacher privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            {session.user.role}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Become a Teacher
          </CardTitle>
          <CardDescription>
            Request teacher privileges to create and manage classes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showForm && !submitted && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                As a teacher, you'll be able to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and manage classes</li>
                <li>• Create assignments and quizzes</li>
                <li>• Grade student submissions</li>
                <li>• Access teacher analytics</li>
                <li>• Manage student progress</li>
              </ul>
              <Button onClick={() => setShowForm(true)} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Request Teacher Status
              </Button>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution/Organization</Label>
                <Input
                  id="institution"
                  placeholder="e.g., University of Technology, High School, Online Academy"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Teaching Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your teaching experience, programming background, or relevant qualifications..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why do you want to become a teacher?</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain your motivation and how you plan to use the platform..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {submitted && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your teacher role request has been submitted successfully! 
                An administrator will review your request and get back to you soon.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Role Request History */}
      {roleRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Role Request History</CardTitle>
            <CardDescription>
              Track the status of your teacher role requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roleRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="font-medium">Teacher Role Request</span>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <Building className="h-3 w-3" />
                      {request.institution}
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" />
                      Submitted: {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    {request.reviewedAt && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {request.adminNotes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <strong>Admin Notes:</strong> {request.adminNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
