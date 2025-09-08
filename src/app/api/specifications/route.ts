import { NextResponse } from 'next/server';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

interface Specification {
  name: string;
  displayName: string;
  path: string;
  size: number;
  downloadUrl: string;
  htmlUrl: string;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://api.github.com/repos/Gaku52/dev-elite-academy/contents/project-docs/specifications',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'dev-elite-academy'
        },
        next: { revalidate: 60 }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json([]);
      }
      throw new Error(`GitHub API request failed: ${response.status}`);
    }

    const files: GitHubFile[] = await response.json();
    
    const htmlFiles = files.filter(file => 
      file.type === 'file' && 
      file.name.toLowerCase().endsWith('.html')
    );

    const specifications: Specification[] = htmlFiles.map(file => ({
      name: file.name,
      displayName: formatDisplayName(file.name),
      path: file.path,
      size: file.size,
      downloadUrl: file.download_url,
      htmlUrl: file.html_url
    }));

    specifications.sort((a, b) => a.displayName.localeCompare(b.displayName));

    return NextResponse.json(specifications);
  } catch (error) {
    console.error('Error fetching specifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specifications' },
      { status: 500 }
    );
  }
}

function formatDisplayName(name: string): string {
  return name
    .replace('.html', '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}