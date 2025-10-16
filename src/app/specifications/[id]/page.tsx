import { notFound } from 'next/navigation';
import { getSpecificationById } from '@/data/specifications';
import PageClient from './PageClient';

interface SpecificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpecificationPage({ params }: SpecificationPageProps) {
  const { id } = await params;
  const document = getSpecificationById(id);

  if (!document) {
    notFound();
  }

  return <PageClient document={document} />;
}
