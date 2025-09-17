import { getServerUser } from '@/lib/server-auth';
import { getServerSideProgress } from '@/lib/server-progress';
import AlgorithmsProgrammingPageClient from './PageClient';

export default async function AlgorithmsProgrammingPage() {
  // サーバーサイドで進捗データを取得
  const user = await getServerUser();
  const { progress } = await getServerSideProgress(user?.id, 'algorithms-programming');

  return (
    <>
      {/* 初期データをスクリプトタグで渡す */}
      <script
        id="server-progress-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(progress || [])
        }}
      />
      <AlgorithmsProgrammingPageClient />
    </>
  );
}