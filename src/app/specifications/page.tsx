import { FolderOpen, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { getAllSpecifications } from '@/data/specifications';

export default function SpecificationsPage() {
  const categories = getAllSpecifications();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          {/* ヘッダー */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              仕様書・設計書
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              プロジェクトの技術仕様書と設計ドキュメントを閲覧できます
            </p>
          </div>

          {/* カテゴリー一覧 */}
          <div className="grid gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-card rounded-lg border border-border p-6 shadow-sm"
              >
                {/* カテゴリーヘッダー */}
                <div className="flex items-center mb-4">
                  <FolderOpen className="w-6 h-6 text-primary mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {category.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* ドキュメント一覧 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {category.documents.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/specifications/${doc.id}`}
                      className="group bg-background hover:bg-accent rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <FileText className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {doc.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span>更新: {doc.updatedAt}</span>
                              <span>{doc.sections.length} セクション</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
