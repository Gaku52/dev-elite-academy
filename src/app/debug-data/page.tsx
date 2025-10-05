'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProgressRecord {
  id: string;
  user_id: string;
  module_name: string;
  section_key: string;
  cycle_number: number;
  is_completed: boolean;
  is_correct: boolean;
  answer_count: number;
  correct_count: number;
  created_at: string;
  updated_at: string;
}

export default function DebugDataPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cycleStats, setCycleStats] = useState<Record<number, {
    total: number;
    completed: number;
    answerCount: number;
    correctCount: number;
  }>>({});

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchData(user.id);
      }
      setLoading(false);
    }
    init();
  }, []);

  const fetchData = async (uid: string) => {
    const { data: records, error } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', uid)
      .order('cycle_number', { ascending: true })
      .order('created_at', { ascending: true });

    if (!error && records) {
      setData(records as ProgressRecord[]);

      // Calculate stats by cycle
      const stats: Record<number, {
        total: number;
        completed: number;
        answerCount: number;
        correctCount: number;
      }> = {};

      records.forEach(record => {
        const cycle = record.cycle_number || 1;
        if (!stats[cycle]) {
          stats[cycle] = {
            total: 0,
            completed: 0,
            answerCount: 0,
            correctCount: 0
          };
        }
        stats[cycle].total++;
        if (record.is_completed) stats[cycle].completed++;
        stats[cycle].answerCount += record.answer_count || 0;
        stats[cycle].correctCount += record.correct_count || 0;
      });

      setCycleStats(stats);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!userId) {
    return <div className="p-8">Please log in first.</div>;
  }

  const cycles = Object.keys(cycleStats).map(Number).sort((a, b) => a - b);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Database Data Debug</h1>

      <div className="mb-8 p-4 bg-gray-100 rounded">
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Total Records:</strong> {data.length}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Cycle Statistics</h2>
        {cycles.map(cycle => {
          const stats = cycleStats[cycle];
          const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const correctRate = stats.answerCount > 0 ? Math.round((stats.correctCount / stats.answerCount) * 100) : 0;

          return (
            <div key={cycle} className="mb-4 p-4 border rounded">
              <h3 className="text-xl font-bold mb-2">第{cycle}周目</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Total Records: {stats.total}</p>
                  <p>Completed: {stats.completed}</p>
                  <p>Completion Rate: {completionRate}%</p>
                </div>
                <div>
                  <p>Total Answers: {stats.answerCount}</p>
                  <p>Correct Answers: {stats.correctCount}</p>
                  <p>Correct Rate: {correctRate}%</p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold">Show Raw Data</summary>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Module</th>
                        <th className="p-2">Section</th>
                        <th className="p-2">Completed</th>
                        <th className="p-2">Correct</th>
                        <th className="p-2">Answer#</th>
                        <th className="p-2">Correct#</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data
                        .filter(r => (r.cycle_number || 1) === cycle)
                        .map(record => (
                          <tr key={record.id} className="border-b">
                            <td className="p-2">{record.module_name}</td>
                            <td className="p-2">{record.section_key}</td>
                            <td className="p-2">{record.is_completed ? '✓' : '✗'}</td>
                            <td className="p-2">{record.is_correct ? '✓' : '✗'}</td>
                            <td className="p-2">{record.answer_count}</td>
                            <td className="p-2">{record.correct_count}</td>
                            <td className="p-2">{new Date(record.created_at).toLocaleString()}</td>
                            <td className="p-2">{new Date(record.updated_at).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">API Stats Response</h2>
        <button
          onClick={async () => {
            const response = await fetch(`/api/learning-progress/reset?userId=${userId}&action=stats`);
            const apiData = await response.json();
            console.log('API Stats Response:', apiData);
            alert('Check console for API response');
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fetch Stats API
        </button>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h3 className="font-bold mb-2">問題の診断:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>総問題数 (期待値):</strong> 876問
          </li>
          <li>
            <strong>第1周目のレコード数:</strong> {cycleStats[1]?.total || 0}
            {cycleStats[1] && cycleStats[1].total < 876 && (
              <span className="text-red-600"> ← 問題: 全問題のレコードが作成されていない</span>
            )}
          </li>
          <li>
            <strong>第2周目のレコード数:</strong> {cycleStats[2]?.total || 0}
            {cycleStats[2] && cycleStats[2].total < 876 && (
              <span className="text-red-600"> ← 問題: 全問題のレコードが作成されていない</span>
            )}
          </li>
          {cycleStats[2] && cycleStats[2].completed === 0 && cycleStats[2].answerCount > 0 && (
            <li className="text-red-600">
              <strong>重大な問題:</strong> 第2周目で回答はあるが(answer_count={cycleStats[2].answerCount})、
              is_completed=trueのレコードが0件
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
