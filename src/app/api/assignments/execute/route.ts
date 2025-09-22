import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { CodeExecutionRequest, CodeExecutionResult, TestResult } from '@/types/assignment';

// POST /api/assignments/execute - Execute code with test cases
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get assignment with test cases
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        id: true,
        testCases: true,
        language: true,
        class: {
          select: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user has access to this assignment
    if (session.user.role === 'STUDENT') {
      const isClassMember = assignment.class.members.length > 0;
      if (!isClassMember) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Execute code with test cases
    const executionRequest: CodeExecutionRequest = {
      code,
      language: language as any,
      testCases: assignment.testCases as any[],
      timeout: 10000, // 10 seconds
      memoryLimit: 128 * 1024 * 1024, // 128 MB
    };

    const results = await executeCode(executionRequest);

    return NextResponse.json({
      success: true,
      results,
      executionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length,
    });
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock code execution function
// In a real implementation, this would use a secure sandbox like Docker
async function executeCode(request: CodeExecutionRequest): Promise<TestResult[]> {
  const { code, language, testCases, timeout, memoryLimit } = request;
  const results: TestResult[] = [];

  // Simulate code execution for each test case
  for (const testCase of testCases) {
    try {
      // Mock execution - in reality, this would run in a secure container
      const startTime = Date.now();
      
      // Simulate different outcomes based on test case
      const isPassing = Math.random() > 0.3; // 70% chance of passing
      
      const executionTime = Date.now() - startTime;
      
      const result: TestResult = {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        passed: isPassing,
        actualOutput: isPassing ? testCase.expectedOutput : 'Incorrect output',
        expectedOutput: testCase.expectedOutput,
        executionTime: executionTime + Math.random() * 100, // Add some randomness
        memoryUsage: Math.floor(Math.random() * 1024 * 1024), // Random memory usage
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

// Real implementation would use Docker or similar containerization
async function executeCodeInSandbox(
  code: string,
  language: string,
  testInput: string,
  timeout: number
): Promise<{ output: string; error?: string; executionTime: number }> {
  // This is a mock implementation
  // In production, you would:
  // 1. Create a Docker container
  // 2. Write the code to a file
  // 3. Execute it with appropriate compiler/interpreter
  // 4. Capture stdout/stderr
  // 5. Kill the container after timeout
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        output: 'Mock output',
        executionTime: Math.random() * 1000,
      });
    }, Math.random() * 500);
  });
}
