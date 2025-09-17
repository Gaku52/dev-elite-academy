'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DailyProgressData {
  date: string;
  totalQuestions: number;
  correctQuestions: number;
  correctRate: number;
  timeSpent: number;
  sectionsCompleted: number;
}

interface DailyProgressChartProps {
  data: DailyProgressData[];
  chartType?: 'line' | 'bar' | 'area';
}

export default function DailyProgressChart({ data, chartType = 'line' }: DailyProgressChartProps) {
  // 日付フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'M/d', { locale: ja });
  };

  // チャート用データの準備
  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
    correctRate: item.correctRate || 0
  }));

  // カスタムツールチップ
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: DailyProgressData;
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              問題数: <span className="font-medium text-gray-900">{data.totalQuestions}問</span>
            </p>
            <p className="text-gray-600">
              正解数: <span className="font-medium text-green-600">{data.correctQuestions}問</span>
            </p>
            <p className="text-gray-600">
              正答率: <span className="font-medium text-blue-600">{data.correctRate}%</span>
            </p>
            <p className="text-gray-600">
              学習時間: <span className="font-medium text-purple-600">{data.timeSpent}分</span>
            </p>
            <p className="text-gray-600">
              完了セクション: <span className="font-medium text-orange-600">{data.sectionsCompleted}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartType === 'area') {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">日次学習推移（エリアチャート）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="totalQuestions"
              name="解答数"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorQuestions)"
            />
            <Area
              type="monotone"
              dataKey="correctQuestions"
              name="正解数"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorCorrect)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === 'bar') {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">日次学習推移（バーチャート）</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="totalQuestions" name="解答数" fill="#3B82F6" />
            <Bar dataKey="correctQuestions" name="正解数" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">日次学習推移</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalQuestions"
            name="解答数"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="correctQuestions"
            name="正解数"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="correctRate"
            name="正答率(%)"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}