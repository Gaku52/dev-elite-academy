import DocumentList from '@/components/documents/DocumentList';
import { specificationsConfig } from '@/config/documents';

export default function SpecificationsPage() {
  return <DocumentList config={specificationsConfig} />;
}