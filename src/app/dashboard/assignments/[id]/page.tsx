'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CodeEditor } from '@/components/assignments/CodeEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Target, 
  Users,
  FileText,
  Code,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react';
import { Assignment, TestResult, ProgrammingLanguage } from '@/types/assignment';

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignmentId = params.id as string;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchAssignment();
  }, [session, status, assignmentId]);

  const fetchAssignment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignment');
      }

      const data: Assignment = await response.json();
      setAssignment(data);
      
      // Set initial code from starter code or default
      if (data.starterCode && data.starterCode.length > 0) {
        setCode(data.starterCode[0].code);
      } else {
        setCode(getDefaultCode(data.language));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (language: ProgrammingLanguage): string => {
    const defaultCode: Record<ProgrammingLanguage, string> = {
      python: `# Write your solution here
def solution():
    pass

# Test your solution
if __name__ == "__main__":
    print(solution())`,
      javascript: `// Write your solution here
function solution() {
    // Your code here
}

// Test your solution
console.log(solution());`,
      typescript: `// Write your solution here
function solution(): any {
    // Your code here
}

// Test your solution
console.log(solution());`,
      java: `public class Solution {
    // Write your solution here
    public static void main(String[] args) {
        // Your code here
    }
}`,
      cpp: `#include <iostream>
using namespace std;

// Write your solution here
int main() {
    // Your code here
    return 0;
}`,
      c: `#include <stdio.h>

// Write your solution here
int main() {
    // Your code here
    return 0;
}`,
      csharp: `using System;

class Program {
    // Write your solution here
    static void Main() {
        // Your code here
    }
}`,
      go: `package main

import "fmt"

// Write your solution here
func main() {
    // Your code here
}`,
      rust: `fn main() {
    // Write your solution here
}`,
      php: `<?php
// Write your solution here

// Test your solution
?>`,
      ruby: `# Write your solution here

# Test your solution`,
      swift: `import Foundation

// Write your solution here`,
      kotlin: `fun main() {
    // Write your solution here
}`,
      scala: `object Solution {
    def main(args: Array[String]): Unit = {
        // Write your solution here
    }
}`,
      r: `# Write your solution here`,
      matlab: `% Write your solution here`,
    };

    return defaultCode[language];
  };

  const handleRunTests = async (codeToTest: string): Promise<TestResult[]> => {
    setIsRunningTests(true);
    
    try {
      const response = await fetch('/api/assignments/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          code: codeToTest,
          language: assignment?.language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run tests');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error running tests:', error);
      return [];
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleSave = async (codeToSave: string): Promise<void> => {
    // Save code to localStorage or send to server
    localStorage.setItem(`assignment_${assignmentId}_code`, codeToSave);
  };

  const handleSubmit = async () => {
    if (!assignment) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId,
          code,
          language: assignment.language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      const data = await response.json();
      router.push(`/dashboard/assignments/${assignmentId}/submission/${data.submissionId}`);
    } catch (error) {
      console.error('Error submitting assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate: Date | string) => {
    return new Date(dueDate) < new Date();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-orange-100 text-orange-800';
      case 'EXPERT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user || !assignment) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
            <p className="text-muted-foreground mt-1">{assignment.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Assignments
            </Button>
            {session.user.role === 'STUDENT' && assignment.status === 'PUBLISHED' && (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Play className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Submit Assignment
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Assignment Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{assignment.instructions}</div>
                </div>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <CodeEditor
              language={assignment.language}
              initialCode={code}
              starterCode={assignment.starterCode?.[0]?.code}
              testCases={assignment.testCases}
              onCodeChange={setCode}
              onRunTests={handleRunTests}
              onSave={handleSave}
              readOnly={assignment.status !== 'PUBLISHED'}
              height="600px"
            />

            {/* Resources */}
            {assignment.resources && assignment.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Additional materials to help you complete this assignment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{resource.name}</span>
                        </div>
                        {resource.type === 'URL' && resource.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Open
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge className={getDifficultyColor(assignment.difficulty)}>
                    {assignment.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Language</span>
                  <Badge variant="outline">{assignment.language}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Points</span>
                  <Badge variant="secondary">{assignment.points}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={isOverdue(assignment.dueDate) ? 'text-red-600 font-medium' : ''}>
                    Due: {formatDate(assignment.dueDate)}
                  </span>
                </div>
                
                {assignment.timeLimit && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Time limit: {assignment.timeLimit} minutes</span>
                  </div>
                )}
                
                {assignment.maxAttempts && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Max attempts: {assignment.maxAttempts}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>
                  {assignment.testCases.length} test case(s) configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignment.testCases.map((testCase, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{testCase.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {testCase.points} pts
                        </Badge>
                      </div>
                      {testCase.isHidden && (
                        <Badge variant="secondary" className="text-xs">
                          Hidden
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Status */}
            {session.user.role === 'STUDENT' && assignment.submissions && assignment.submissions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignment.submissions.map((submission, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Attempt {submission.attempts}
                          </span>
                          <Badge 
                            variant={
                              submission.status === 'GRADED' ? 'default' :
                              submission.status === 'SUBMITTED' ? 'secondary' :
                              submission.status === 'LATE' ? 'destructive' : 'outline'
                            }
                          >
                            {submission.status}
                          </Badge>
                        </div>
                        {submission.score !== undefined && (
                          <div className="text-sm text-muted-foreground">
                            Score: {submission.score}/{submission.maxScore}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {formatDate(submission.submittedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teacher Actions */}
            {session.user.role === 'TEACHER' && (
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/assignments/${assignmentId}/edit`)}
                  >
                    Edit Assignment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/assignments/${assignmentId}/submissions`)}
                  >
                    View Submissions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/assignments/${assignmentId}/analytics`)}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
