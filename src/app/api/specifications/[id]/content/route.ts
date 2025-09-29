import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // HTMLファイル名を構築
    const filename = `${id}.html`;

    // GitHub APIからHTMLコンテンツを取得
    const response = await fetch(
      `https://api.github.com/repos/Gaku52/dev-elite-academy/contents/project-docs/specifications/${filename}`,
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
        return NextResponse.json(
          { error: 'Specification not found' },
          { status: 404 }
        );
      }
      throw new Error(`GitHub API request failed: ${response.status}`);
    }

    const fileData = await response.json();

    // Base64でエンコードされたコンテンツをデコード
    if (fileData.encoding !== 'base64') {
      throw new Error('Unexpected file encoding');
    }

    const htmlContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    // HTMLコンテンツをサニタイズして返す（XSS攻撃対策）
    const sanitizedContent = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
        'ul', 'ol', 'li', 'dl', 'dt', 'dd',
        'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small',
        'code', 'pre', 'kbd', 'samp', 'var',
        'a', 'img',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'div', 'span', 'section', 'article', 'header', 'footer',
        'blockquote', 'cite', 'q'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id', 'style',
        'target', 'rel', 'width', 'height',
        'colspan', 'rowspan', 'scope'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ALLOW_DATA_ATTR: false
    });

    return new Response(sanitizedContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300' // 5分間キャッシュ
      }
    });

  } catch (error) {
    console.error('Error fetching specification content:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch specification content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}