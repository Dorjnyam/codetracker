import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { TestResult } from '@/types/assignment';

// POST /api/assignments/submit - Submit assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only students can submit assignments
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { assignmentId, code, language }: {
      assignmentId: string;
      code: string;
      language: string;
    } = body;

    if (!assignmentId || !code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get assignment details
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        class: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
        submissions: {
          where: { studentId: session.user.id },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if assignment is published
    if (assignment.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Assignment not available' }, { status: 403 });
    }

    // Check if user is enrolled in the class
    const isClassMember = assignment.class.members.length > 0;
    if (!isClassMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if assignment is still open
    const now = new Date();
    if (now > assignment.dueDate) {
      return NextResponse.json({ error: 'Assignment deadline has passed' }, { status: 400 });
    }

    // Check attempt limit
    if (assignment.maxAttempts && assignment.submissions.length >= assignment.maxAttempts) {
      return NextResponse.json({ error: 'Maximum attempts exceeded' }, { status: 400 });
    }

    // Run test cases
    const testResults = await runTestCases(code, language, assignment.testCases as any[]);
    
    // Calculate score
    const totalPoints = testResults.reduce((sum, result) => sum + result.maxPoints, 0);
    const earnedPoints = testResults.reduce((sum, result) => sum + result.points, 0);
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * assignment.points) : 0;

    // Determine submission status
    const isLate = now > assignment.dueDate;
    const status = isLate ? 'LATE' : 'SUBMITTED';

    // Create submission
    const submission = await db.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: session.user.id,
        code,
        language: language as any,
        status,
        score,
        maxScore: assignment.points,
        attempts: assignment.submissions.length + 1,
        submittedAt: now,
        testResults: testResults as any,
        executionTime: testResults.reduce((sum, r) => sum + r.executionTime, 0),
        memoryUsage: testResults.reduce((sum, r) => sum + r.memoryUsage, 0),
      },
      include: {
        assignment: {
          select: {
            title: true,
            points: true,
          },
        },
      },
    });

    // Update assignment analytics
    await updateAssignmentAnalytics(assignmentId);

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      score,
      maxScore: assignment.points,
      testResults,
      status,
      message: 'Assignment submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock function to run test cases
async function runTestCases(
  code: string,
  language: string,
  testCases: any[]
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const testCase of testCases) {
    try {
      const startTime = Date.now();
      
      // Mock test execution
      // In reality, this would execute the code in a secure sandbox
      const isPassing = Math.random() > 0.2; // 80% chance of passing
      
      const executionTime = Date.now() - startTime;
      
      const result: TestResult = {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        passed: isPassing,
        actualOutput: isPassing ? testCase.expectedOutput : 'Incorrect output',
        expectedOutput: testCase.expectedOutput,
        executionTime: executionTime + Math.random() * 100,
        memoryUsage: Math.floor(Math.random() * 1024 * 1024),
        points: isPassing ? testCase.points : 0,
        maxPoints: testCase.points,
        errorMessage: isPassing ? undefined : 'Test case failed',
      };

      results.push(result);
    } catch (error) {
      const result: TestResult = {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        passed: false,
        actualOutput: '',
        expectedOutput: testCase.expectedOutput,
        executionTime: 0,
        memoryUsage: 0,
        points: 0,
        maxPoints: testCase.points,
        errorMessage: error instanceof Error ? error.message : 'Execution error',
      };

      results.push(result);
    }
  }

  return results;
}

// Update assignment analytics
async function updateAssignmentAnalytics(assignmentId: string) {
  try {
    const submissions = await db.assignmentSubmission.findMany({
      where: { assignmentId },
      select: {
        score: true,
        maxScore: true,
        submittedAt: true,
      },
    });

    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0 
      ? submissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions 
      : 0;
    
    const completionRate = totalSubmissions > 0 ? 100 : 0; // Simplified calculation

    await db.assignmentAnalytics.upsert({
      where: { assignmentId },
      update: {
        totalSubmissions,
        averageScore,
        completionRate,
        lastUpdated: new Date(),
      },
      create: {
        assignmentId,
        totalSubmissions,
        averageScore,
        completionRate,
        averageExecutionTime: 0,
        commonErrors: [],
        difficultyRating: 0,
        studentFeedback: [],
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}
