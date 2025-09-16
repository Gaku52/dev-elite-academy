import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
            <div className="text-6xl mb-4">🔍</div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              ページが見つかりません
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              お探しのページは存在しないか、移動または削除された可能性があります。
            </p>
            <p className="text-gray-500">
              URLをご確認いただくか、下のボタンからホームページにお戻りください。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#8E9C78] text-white rounded-lg hover:bg-[#7a8a6a] transition-colors text-lg font-medium"
            >
              🏠 ホームに戻る
            </Link>
            
            <Link
              href="/learn"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#8E9C78] hover:text-[#8E9C78] transition-colors text-lg font-medium"
            >
              📚 学習を始める
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              よく使われるページ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <Link
                href="/dashboard"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#8E9C78] hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-gray-900">ダッシュボード</div>
              </Link>
              
              <Link
                href="/specifications"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#8E9C78] hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium text-gray-900">仕様書</div>
              </Link>
              
              <Link
                href="/usage"
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[#8E9C78] hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">📖</div>
                <div className="font-medium text-gray-900">使い方</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}