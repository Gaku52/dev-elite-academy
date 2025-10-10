import { NextRequest, NextResponse } from 'next/server';

const GITHUB_REPO = 'Gaku52/dev-elite-academy';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Construct raw GitHub URL
    const rawUrl = `${GITHUB_RAW_BASE}/${GITHUB_REPO}/main/${filePath}`;

    const response = await fetch(rawUrl, {
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'dev-elite-academy',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GitHub raw content error: ${response.status}`);
    }

    const content = await response.text();

    return NextResponse.json({
      content,
      path: filePath,
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file content from GitHub' },
      { status: 500 }
    );
  }
}
