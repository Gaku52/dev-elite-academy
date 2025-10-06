import { NextResponse } from 'next/server';
import type { GitHubFile, DocumentItem } from '@/types/documents';

/**
 * GitHubからドキュメント一覧を取得する共通関数
 */
export async function fetchGitHubDocuments(
  githubPath: string
): Promise<DocumentItem[]> {
  const response = await fetch(
    `https://api.github.com/repos/Gaku52/dev-elite-academy/contents/${githubPath}`,
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
      return [];
    }
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  const files: GitHubFile[] = await response.json();

  const htmlFiles = files.filter(file =>
    file.type === 'file' &&
    file.name.toLowerCase().endsWith('.html')
  );

  const documents: DocumentItem[] = htmlFiles.map(file => ({
    name: file.name,
    displayName: formatDisplayName(file.name),
    path: file.path,
    size: file.size,
    downloadUrl: file.download_url,
    htmlUrl: file.html_url
  }));

  documents.sort((a, b) => a.displayName.localeCompare(b.displayName));

  return documents;
}

/**
 * GitHubからドキュメントのHTMLコンテンツを取得する共通関数
 */
export async function fetchGitHubDocumentContent(
  githubPath: string,
  filename: string
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/Gaku52/dev-elite-academy/contents/${githubPath}/${filename}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'dev-elite-academy'
      },
      next: { revalidate: 300 } // 5分間キャッシュ
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Document not found');
    }
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  const fileData = await response.json();

  if (fileData.encoding !== 'base64') {
    throw new Error('Unexpected file encoding');
  }

  return Buffer.from(fileData.content, 'base64').toString('utf8');
}

/**
 * ドキュメント一覧取得APIのレスポンスを生成
 */
export async function createDocumentListResponse(githubPath: string) {
  try {
    const documents = await fetchGitHubDocuments(githubPath);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

/**
 * ファイル名を表示用の名前にフォーマット
 */
function formatDisplayName(name: string): string {
  return name
    .replace('.html', '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
