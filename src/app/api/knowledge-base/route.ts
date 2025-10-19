import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const docPath = searchParams.get('path');

  if (!docPath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    // Build the file path
    const docsDir = path.join(process.cwd(), 'docs', 'knowledge-base');
    let filePath: string;

    if (docPath === 'README') {
      filePath = path.join(docsDir, 'README.md');
    } else {
      filePath = path.join(docsDir, `${docPath}.md`);
    }

    // Security check: ensure the path is within the docs directory
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(docsDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    // Read the markdown file
    const markdownContent = await fs.readFile(filePath, 'utf-8');

    // Convert markdown to HTML
    const htmlContent = await marked.parse(markdownContent);

    return NextResponse.json({ content: htmlContent });
  } catch (error) {
    console.error('Error reading markdown file:', error);

    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
