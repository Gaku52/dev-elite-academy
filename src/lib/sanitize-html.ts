import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { diagnosticSecurityFeature } from './diagnostic-logger';

/**
 * HTMLコンテンツをサニタイズする共通関数
 */
export function sanitizeHtmlContent(htmlContent: string): string {
  const sanitizedHtml = diagnosticSecurityFeature("XSS対策 HTMLサニタイゼーション", () => {
    console.log('🧽 HTMLサニタイゼーション開始');
    console.log('📏 元のHTML長さ:', htmlContent.length);

    // Server-side DOMPurify setup
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);

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

  return sanitizedHtml.success ? (sanitizedHtml.result as string) : htmlContent;
}

/**
 * サニタイズされたHTMLレスポンスを生成
 */
export function createSanitizedHtmlResponse(htmlContent: string): Response {
  const sanitizedHtml = sanitizeHtmlContent(htmlContent);

  return new Response(sanitizedHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300', // 5分間キャッシュ
      'X-XSS-Protection': '1; mode=block', // 追加のXSS保護
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
