import { getServerUser } from '@/lib/server-auth';
import { getServerSideProgress } from '@/lib/server-progress';
import ComputerSystemsPageClient from './PageClient';

export default async function ComputerSystemsPage() {
  // サーバーサイドで進捗データを取得
  const user = await getServerUser();
  const { progress } = await getServerSideProgress(user?.id, 'computer-systems');

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
      <ComputerSystemsPageClient />
    </>
  );
}