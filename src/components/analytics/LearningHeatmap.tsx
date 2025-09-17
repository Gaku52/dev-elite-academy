'use client';

import { format, eachDayOfInterval, subDays, startOfWeek, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Tooltip } from 'recharts';

interface DailyData {
  date: string;
  totalQuestions: number;
}

interface LearningHeatmapProps {
  data: DailyData[];
  days?: number;
}

export default function LearningHeatmap({ data, days = 365 }: LearningHeatmapProps) {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);

  // データを日付でマッピング
  const dataMap = new Map(data.map(d => [d.date, d.totalQuestions]));

  // 日付の範囲を生成
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // 週ごとにグループ化
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  dateRange.forEach((date, index) => {
    const dayOfWeek = getDay(date);

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [date];
    } else {
      currentWeek.push(date);
    }

    if (index === dateRange.length - 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  });

  // 最初の週を日曜日から始まるように調整
  if (weeks.length > 0 && getDay(weeks[0][0]) !== 0) {
    const firstWeek = weeks[0];
    const firstDay = getDay(firstWeek[0]);
    const emptyDays = Array(firstDay).fill(null);
    weeks[0] = [...emptyDays, ...firstWeek];
  }

  // 活動レベルの計算
  const getActivityLevel = (questions: number): string => {
    if (questions === 0) return 'bg-gray-100';
    if (questions < 5) return 'bg-green-200';
    if (questions < 10) return 'bg-green-400';
    if (questions < 20) return 'bg-green-600';
    return 'bg-green-800';
  };

  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  // 月ラベルの位置を計算
  const getMonthLabels = () => {
    const labels: { month: string; position: number }[] = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      week.forEach(date => {
        if (date) {
          const month = date.getMonth();
          if (month !== currentMonth) {
            currentMonth = month;
            labels.push({
              month: months[month],
              position: weekIndex
            });
          }
        }
      });
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">学習カレンダー</h3>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* 月ラベル */}
          <div className="flex mb-2 ml-10">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-gray-600"
                style={{ marginLeft: index === 0 ? `${label.position * 13}px` : `${(label.position - monthLabels[index - 1].position) * 13 - 24}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* 曜日ラベル */}
            <div className="flex flex-col justify-between mr-2 py-1">
              {weekDays.map((day, index) => (
                <div key={index} className="text-xs text-gray-600 h-3 flex items-center">
                  {index % 2 === 0 && day}
                </div>
              ))}
            </div>

            {/* ヒートマップ */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                    const date = week[dayIndex];
                    if (!date) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }

                    const dateStr = format(date, 'yyyy-MM-dd');
                    const questions = dataMap.get(dateStr) || 0;
                    const level = getActivityLevel(questions);

                    return (
                      <div key={dayIndex} className="relative group">
                        <div
                          className={`w-3 h-3 rounded-sm ${level} border border-gray-300 cursor-pointer transition-all hover:scale-125`}
                        />
                        {/* ツールチップ */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                          <div>{format(date, 'yyyy年M月d日', { locale: ja })}</div>
                          <div>{questions > 0 ? `${questions}問解答` : '学習なし'}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 凡例 */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
            <span>少ない</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-300"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm border border-gray-300"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm border border-gray-300"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm border border-gray-300"></div>
              <div className="w-3 h-3 bg-green-800 rounded-sm border border-gray-300"></div>
            </div>
            <span>多い</span>
          </div>
        </div>
      </div>
    </div>
  );
}