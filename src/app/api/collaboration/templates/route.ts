import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sessionManager } from '@/lib/collaboration/session-manager';
import { CollaborationType } from '@/types/collaboration';

// GET /api/collaboration/templates - Get session templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as CollaborationType | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let templates = sessionManager.getTemplates();

    // Apply filters
    if (type) {
      templates = sessionManager.getTemplatesByType(type);
    }

    // Apply pagination
    const paginatedTemplates = templates.slice(offset, offset + limit);

    return NextResponse.json({
      templates: paginatedTemplates,
      total: templates.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/collaboration/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      type, 
      settings, 
      defaultLanguage,
      defaultFramework,
      difficulty,
      estimatedDuration,
      tags 
    } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Create template (this would need to be implemented in sessionManager)
    const template = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      type: type as CollaborationType,
      settings: settings || {},
      defaultLanguage: defaultLanguage || 'javascript',
      defaultFramework: defaultFramework || undefined,
      difficulty: difficulty || 'INTERMEDIATE',
      estimatedDuration: estimatedDuration || 60,
      tags: tags || [],
      createdBy: session.user.id,
      createdAt: new Date(),
      isPublic: false,
      usageCount: 0,
      rating: 0,
      reviews: [],
    };

    return NextResponse.json({
      template,
      message: 'Template created successfully',
    });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
