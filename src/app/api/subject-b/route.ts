import { createDocumentListResponse } from '@/lib/github-documents';

export async function GET() {
  return createDocumentListResponse('project-docs/subject-b');
}
