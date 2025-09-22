'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { CreateAssignmentForm } from '@/types/assignment';

export default function CreateAssignmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || !['TEACHER', 'ADMIN'].includes(session.user.role)) {
    return null;
  }

  const handleSubmit = async (data: CreateAssignmentForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assignment');
      }

      const assignment = await response.json();
      router.push(`/dashboard/assignments/${assignment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
            <p className="text-muted-foreground">
              Create a new coding assignment for your students
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Assignments
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Assignment Form */}
        <AssignmentForm
          onSubmit={handleSubmit}
          isEditing={false}
        />

        {/* Help Card */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Creation Tips</CardTitle>
            <CardDescription>
              Best practices for creating effective coding assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Clear Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Provide detailed, step-by-step instructions that students can easily follow.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Appropriate Difficulty</h4>
                <p className="text-sm text-muted-foreground">
                  Choose difficulty levels that match your students' skill levels.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Test Cases</h4>
                <p className="text-sm text-muted-foreground">
                  Include comprehensive test cases to ensure code correctness.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Starter Code</h4>
                <p className="text-sm text-muted-foreground">
                  Provide helpful starter code to get students started quickly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
