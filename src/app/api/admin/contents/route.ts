import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = categoryId ? { categoryId: parseInt(categoryId) } : {};

    const [contents, total] = await Promise.all([
      prisma.learningContent.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { categoryId: 'asc' },
          { id: 'asc' }
        ],
        include: {
          category: true,
          _count: {
            select: {
              progress: true,
              studyPlans: true
            }
          }
        }
      }),
      prisma.learningContent.count({ where })
    ]);

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryId,
      title,
      description,
      contentType,
      contentBody,
      difficulty,
      estimatedTime,
      tags,
      isPublished
    } = body;

    if (!categoryId || !title || !contentType || !contentBody || !difficulty) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const content = await prisma.learningContent.create({
      data: {
        categoryId,
        title,
        description,
        contentType,
        contentBody,
        difficulty,
        estimatedTime: estimatedTime ?? 30,
        tags: tags ?? [],
        isPublished: isPublished ?? false
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      categoryId,
      title,
      description,
      contentType,
      contentBody,
      difficulty,
      estimatedTime,
      tags,
      isPublished
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const content = await prisma.learningContent.update({
      where: { id },
      data: {
        categoryId,
        title,
        description,
        contentType,
        contentBody,
        difficulty,
        estimatedTime,
        tags,
        isPublished
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.learningContent.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}