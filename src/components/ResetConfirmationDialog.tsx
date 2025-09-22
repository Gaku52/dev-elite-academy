'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, RotateCcw, BarChart3, TrendingUp } from 'lucide-react';

interface CycleStats {
  cycle_number: number;
  total_questions: number;
  completed_questions: number;
  correct_questions: number;
  completion_rate: number;
  cycle_start_date: string;
  cycle_last_update: string;
}

interface ResetPreview {
  preservedData: string[];
  resetData: string[];
  benefits: string[];
}

interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resetType: 'safe' | 'complete') => Promise<void>;
  currentCycle: number;
  nextCycle: number;
  cycleStats: CycleStats[];
  resetPreview: ResetPreview;
  moduleName?: string;
  isLoading?: boolean;
}

export default function ResetConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  currentCycle,
  nextCycle,
  cycleStats,
  resetPreview,
  moduleName,
  isLoading = false
}: ResetConfirmationDialogProps) {
  const [resetType, setResetType] = useState<'safe' | 'complete'>('safe');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm(resetType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* ヘッダー */}
          <div className="flex items-center mb-6">
            <div className="p-3 bg-yellow-100 rounded-full mr-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                学習進捗をリセットしますか？
              </h2>
              <p className="text-gray-600 text-sm">
                {moduleName ? `${moduleName}モジュール` : '全モジュール'}の進捗をリセットします
              </p>
            </div>
          </div>

          {/* 周回移行情報 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <RotateCcw className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">周回移行</h3>
            </div>
            <div className="text-blue-800">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                第{currentCycle}周目
              </span>
              <span className="mx-2">→</span>
              <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">
                第{nextCycle}周目
              </span>
            </div>
          </div>

          {/* リセットタイプ選択 */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">リセットタイプを選択</h3>
            <div className="space-y-3">
              {/* 安全なリセット */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  resetType === 'safe'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setResetType('safe')}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={resetType === 'safe'}
                    onChange={() => setResetType('safe')}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-900">
                        安全なリセット（推奨）
                      </h4>
                    </div>
                    <p className="text-green-800 text-sm">
                      学習記録を保持しながら新しい周回を開始します
                    </p>
                  </div>
                </div>
              </div>

              {/* 完全リセット */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  resetType === 'complete'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
                onClick={() => setResetType('complete')}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    checked={resetType === 'complete'}
                    onChange={() => setResetType('complete')}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      <h4 className="font-semibold text-red-900">
                        完全リセット（非推奨）
                      </h4>
                    </div>
                    <p className="text-red-800 text-sm">
                      全ての学習記録を削除します（復元不可能）
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {resetType === 'safe' && (
            <>
              {/* 保持されるデータ */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">保持されるデータ</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resetPreview.preservedData.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-green-800 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* リセットされる内容 */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <RotateCcw className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">リセットされる内容</h3>
                </div>
                <div className="space-y-2">
                  {resetPreview.resetData.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <RotateCcw className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-blue-800 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* メリット */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-900">周回システムのメリット</h3>
                </div>
                <div className="space-y-2">
                  {resetPreview.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" />
                      <span className="text-purple-800 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 過去の周回実績 */}
              {cycleStats.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">過去の周回実績</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {cycleStats.slice(-3).map((stat) => (
                        <div key={stat.cycle_number} className="flex justify-between items-center">
                          <span className="font-medium">第{stat.cycle_number}周目</span>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              {stat.completed_questions}/{stat.total_questions}問
                            </span>
                            <span className="font-medium text-green-600">
                              {stat.completion_rate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {resetType === 'complete' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-900">⚠️ 重要な警告</h3>
              </div>
              <p className="text-red-800 text-sm mb-3">
                完全リセットを実行すると、以下のデータが永久に失われます：
              </p>
              <ul className="text-red-800 text-sm space-y-1 list-disc list-inside">
                <li>全ての学習進捗データ</li>
                <li>過去の回答履歴</li>
                <li>統計情報</li>
                <li>周回記録</li>
              </ul>
              <p className="text-red-800 text-sm mt-3 font-semibold">
                この操作は取り消すことができません。
              </p>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                resetType === 'safe'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  実行中...
                </div>
              ) : (
                resetType === 'safe' ? '安全なリセット実行' : '完全リセット実行'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}