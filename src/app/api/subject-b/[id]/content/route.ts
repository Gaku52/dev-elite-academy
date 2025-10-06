import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubDocumentContent } from '@/lib/github-documents';
import { createSanitizedHtmlResponse } from '@/lib/sanitize-html';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filename = `${id}.html`;

    const htmlContent = await fetchGitHubDocumentContent(
      'project-docs/subject-b',
      filename
    );

    return createSanitizedHtmlResponse(htmlContent);
  } catch (error) {
    console.error('Error fetching question content:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch question content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
