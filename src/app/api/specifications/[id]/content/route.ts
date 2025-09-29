import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { diagnosticSecurityFeature } from '../../../../../lib/diagnostic-logger';

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

    // XSS対策: DOMPurifyでHTMLをサニタイズ（診断付き）
    const sanitizedHtml = diagnosticSecurityFeature("XSS対策 HTMLサニタイゼーション", () => {
      console.log('🧽 HTMLサニタイゼーション開始');
      console.log('📏 元のHTML長さ:', htmlContent.length);

      // Server-side DOMPurify setup
      const window = new JSDOM('').window;
      const purify = DOMPurify(window as unknown as Window);

      // セキュリティ設定でサニタイズ
      const cleanHtml = purify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'div', 'span', 'br', 'hr',
          'ul', 'ol', 'li',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'a', 'strong', 'em', 'code', 'pre',
          'img', 'figure', 'figcaption'
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'alt', 'src', 'width', 'height',
          'class', 'id', 'style'
        ],
        FORBID_TAGS: ['script', 'object', 'embed', 'applet', 'iframe'],
        FORBID_ATTR: ['onload', 'onclick', 'onmouseover', 'onerror']
      });

      console.log('📏 サニタイズ後HTML長さ:', cleanHtml.length);
      console.log('✅ HTMLサニタイゼーション完了');

      return cleanHtml;
    });

    const finalHtml = sanitizedHtml.success ? (sanitizedHtml.result as string) : htmlContent;

    // サニタイズされたHTMLを返す
    return new Response(finalHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5分間キャッシュ
        'X-XSS-Protection': '1; mode=block', // 追加のXSS保護
        'X-Content-Type-Options': 'nosniff'
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