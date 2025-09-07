import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const isPublic = searchParams.get('isPublic') === 'true';

    const where: Record<string, unknown> = {};
    if (userId) {
      where.OR = [
        { createdBy: userId },
        { isPublic: true }
      ];
    } else if (isPublic) {
      where.isPublic = true;
    }

    const learningPaths = await prisma.learningPath.findMany({
      where,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        units: {
          include: {
            unit: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        },
        _count: {
          select: {
            userPaths: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(learningPaths);
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the current user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, categoryId, isPublic, isTemplate, tags, difficulty, estimatedDays, units } = body;

    // Create learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        title,
        description,
        categoryId: categoryId ? parseInt(categoryId) : null,
        createdBy: user.id,
        isPublic: isPublic || false,
        isTemplate: isTemplate || false,
        tags: tags || [],
        difficulty,
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : null
      }
    });

    // Add units if provided
    if (units && units.length > 0) {
      const pathUnits = units.map((unit: { unitId: string; isRequired?: boolean }, index: number) => ({
        pathId: learningPath.id,
        unitId: unit.unitId,
        sortOrder: index,
        isRequired: unit.isRequired !== false
      }));

      await prisma.learningPathUnit.createMany({
        data: pathUnits
      });
    }

    // Fetch the complete learning path with relations
    const completeLearningPath = await prisma.learningPath.findUnique({
      where: { id: learningPath.id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        units: {
          include: {
            unit: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    });

    return NextResponse.json(completeLearningPath, { status: 201 });
  } catch (error) {
    console.error('Error creating learning path:', error);
    return NextResponse.json(
      { error: 'Failed to create learning path' },
      { status: 500 }
    );
  }
}