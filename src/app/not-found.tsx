import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-muted mb-4">404</div>
            <div className="text-6xl mb-4">🔍</div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-foreground">
              ページが見つかりません
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              お探しのページは存在しないか、移動または削除された可能性があります。
            </p>
            <p className="text-muted-foreground">
              URLをご確認いただくか、下のボタンからホームページにお戻りください。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              🏠 ホームに戻る
            </Link>

            <Link
              href="/learn"
              className="inline-flex items-center justify-center px-8 py-4 bg-secondary border-2 border-border text-foreground rounded-lg hover:bg-accent transition-colors text-lg font-medium"
            >
              📚 学習を始める
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              よく使われるページ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <Link
                href="/dashboard"
                className="p-4 bg-card rounded-lg border border-border hover:bg-accent hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-foreground">ダッシュボード</div>
              </Link>

              <Link
                href="/specifications"
                className="p-4 bg-card rounded-lg border border-border hover:bg-accent hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium text-foreground">仕様書</div>
              </Link>

              <Link
                href="/usage"
                className="p-4 bg-card rounded-lg border border-border hover:bg-accent hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">📖</div>
                <div className="font-medium text-foreground">使い方</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}