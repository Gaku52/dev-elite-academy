import { NextResponse } from 'next/server';

const GITHUB_REPO = 'Gaku52/dev-elite-academy';
const CONTENT_PATH = 'content/fe-exam';
const GITHUB_API_BASE = 'https://api.github.com';

export async function GET() {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_REPO}/contents/${CONTENT_PATH}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'dev-elite-academy',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();

    // Filter only .md files
    const mdFiles = files
      .filter((file: { name: string; type: string }) =>
        file.type === 'file' && file.name.endsWith('.md')
      )
      .map((file: { name: string; path: string; download_url: string }) => ({
        name: file.name,
        path: file.path,
        downloadUrl: file.download_url,
        displayName: file.name.replace('.md', '').replace(/-/g, ' '),
      }));

    return NextResponse.json({ files: mdFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files from GitHub' },
      { status: 500 }
    );
  }
}
