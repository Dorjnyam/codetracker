import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { UpdateAssignmentForm } from '@/types/assignment';

// GET /api/assignments/[id] - Get assignment details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignment = await db.assignment.findUnique({
      where: { id: params.id },
      include: {
        class: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        submissions: session.user.role === 'STUDENT' 
          ? {
              where: { studentId: session.user.id },
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            }
          : {
              include: {
                student: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check access permissions
    if (session.user.role === 'STUDENT') {
      // Students can only access published assignments from their classes
      if (assignment.status !== 'PUBLISHED') {
        return NextResponse.json({ error: 'Assignment not available' }, { status: 403 });
      }

      const isClassMember = assignment.class.members.some(
        member => member.userId === session.user.id
      );
      
      if (!isClassMember) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'TEACHER') {
      // Teachers can only access their own assignments
      if (assignment.teacherId !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/assignments/[id] - Update assignment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers and admins can update assignments
    if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updateData: UpdateAssignmentForm = body;

    // Verify assignment exists and user has access
    const existingAssignment = await db.assignment.findFirst({
      where: {
        id: params.id,
        teacherId: session.user.id,
      },
    });

    if (!existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Prepare update data
    const updateFields: any = {};
    
    if (updateData.title) updateFields.title = updateData.title;
    if (updateData.description) updateFields.description = updateData.description;
    if (updateData.instructions) updateFields.instructions = updateData.instructions;
    if (updateData.language) updateFields.language = updateData.language;
    if (updateData.difficulty) updateFields.difficulty = updateData.difficulty;
    if (updateData.dueDate) updateFields.dueDate = new Date(updateData.dueDate);
    if (updateData.timeLimit !== undefined) updateFields.timeLimit = updateData.timeLimit;
    if (updateData.maxAttempts !== undefined) updateFields.maxAttempts = updateData.maxAttempts;
    if (updateData.points) updateFields.points = updateData.points;
    if (updateData.starterCode) updateFields.starterCode = updateData.starterCode;
    if (updateData.testCases) updateFields.testCases = updateData.testCases;
    if (updateData.resources) updateFields.resources = updateData.resources;

    updateFields.updatedAt = new Date();

    const updatedAssignment = await db.assignment.update({
      where: { id: params.id },
      data: updateFields,
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

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/assignments/[id] - Delete assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers and admins can delete assignments
    if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify assignment exists and user has access
    const existingAssignment = await db.assignment.findFirst({
      where: {
        id: params.id,
        teacherId: session.user.id,
      },
    });

    if (!existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if assignment has submissions
    const submissionCount = await db.assignmentSubmission.count({
      where: { assignmentId: params.id },
    });

    if (submissionCount > 0) {
      // Archive instead of delete if there are submissions
      await db.assignment.update({
        where: { id: params.id },
        data: {
          status: 'ARCHIVED',
          archivedAt: new Date(),
        },
      });
    } else {
      // Safe to delete if no submissions
      await db.assignment.delete({
        where: { id: params.id },
      });
    }

    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
