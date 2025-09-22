import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  AssignmentListParams, 
  AssignmentListResponse, 
  CreateAssignmentForm,
  AssignmentFilter,
  AssignmentSort 
} from '@/types/assignment';

// GET /api/assignments - List assignments with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const search = searchParams.get('search') || '';
    const language = searchParams.get('language')?.split(',') || [];
    const difficulty = searchParams.get('difficulty')?.split(',') || [];
    const status = searchParams.get('status')?.split(',') || [];
    const classId = searchParams.get('classId') || '';
    const sortField = searchParams.get('sortField') || 'dueDate';
    const sortDirection = searchParams.get('sortDirection') || 'asc';

    // Build filter object
    const filter: AssignmentFilter = {
      language: language.length > 0 ? language as any[] : undefined,
      difficulty: difficulty.length > 0 ? difficulty as any[] : undefined,
      status: status.length > 0 ? status as any[] : undefined,
      classId: classId || undefined,
      search: search || undefined,
    };

    const sort: AssignmentSort = {
      field: sortField as any,
      direction: sortDirection as 'asc' | 'desc',
    };

    const params: AssignmentListParams = {
      page,
      limit,
      filter,
      sort,
    };

    // Build Prisma query
    const where: any = {};
    
    // Add search filter if search term exists
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (language.length > 0) {
      where.language = { in: language };
    }

    if (difficulty.length > 0) {
      where.difficulty = { in: difficulty };
    }

    if (status.length > 0) {
      where.status = { in: status };
    }

    if (classId) {
      where.classId = classId;
    }

    // Role-based filtering
    if (session.user.role === 'STUDENT') {
      // Students can only see published assignments from their classes
      where.status = 'PUBLISHED';
      where.class = {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      };
    } else if (session.user.role === 'TEACHER') {
      // Teachers can see their own assignments
      where.teacherId = session.user.id;
    }

    const orderBy: any = {};
    orderBy[sort.field] = sort.direction;

    const [assignments, total] = await Promise.all([
      db.assignment.findMany({
        where,
        include: {
          class: true,
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          submissions: {
            where: session.user.role === 'STUDENT' 
              ? { studentId: session.user.id }
              : undefined,
            select: {
              id: true,
              status: true,
              score: true,
              submittedAt: true,
            },
          },
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.assignment.count({ where }),
    ]);

    const response: AssignmentListResponse = {
      assignments: assignments as any[],
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/assignments - Create new assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers and admins can create assignments
    if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      instructions,
      language,
      difficulty,
      dueDate,
      timeLimit,
      maxAttempts,
      points,
      classId,
      starterCode,
      testCases,
      resources,
    }: CreateAssignmentForm = body;

    // Validate required fields
    if (!title || !description || !instructions || !language || !difficulty || !dueDate || !points || !classId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify class exists and user has access
    const classExists = await db.class.findFirst({
      where: {
        id: classId,
        OR: [
          { teacherId: session.user.id },
          { members: { some: { userId: session.user.id, role: 'TEACHER' } } },
        ],
      },
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Class not found or access denied' },
        { status: 404 }
      );
    }

    // Create assignment
    const assignment = await db.assignment.create({
      data: {
        title,
        description,
        instructions,
        language,
        difficulty,
        dueDate: new Date(dueDate),
        timeLimit,
        maxAttempts,
        points,
        classId,
        teacherId: session.user.id,
        status: 'DRAFT',
        rubric: {
          id: `rubric_${Date.now()}`,
          name: 'Default Rubric',
          description: 'Default grading rubric',
          criteria: [
            {
              id: `criteria_${Date.now()}`,
              name: 'Correctness',
              description: 'Code produces correct output',
              points: points,
              weight: 1,
            },
          ],
          totalPoints: points,
        },
        starterCode: starterCode || [],
        testCases: testCases || [],
        resources: resources || [],
      },
      include: {
        class: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
