import { CheckCircle, Circle } from 'lucide-react';
import { Module } from '@/types/learning';

interface ModuleSidebarProps {
  modules: Module[];
  activeModule: number;
  activeSection: number;
  completedQuizzes: Set<string>;
  totalQuizzes: number;
  onModuleSelect: (moduleIndex: number, sectionIndex: number) => void;
  onSectionSelect: (sectionIndex: number) => void;
}

export default function ModuleSidebar({
  modules,
  activeModule,
  activeSection,
  completedQuizzes,
  totalQuizzes,
  onModuleSelect,
  onSectionSelect
}: ModuleSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <h3 className="font-semibold mb-4 text-gray-900">学習モジュール</h3>

      <nav className="space-y-2">
        {modules.map((module, moduleIndex) => (
          <div key={module.id}>
            <button
              onClick={() => onModuleSelect(moduleIndex, 0)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                activeModule === moduleIndex
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {module.title}
            </button>

            {activeModule === moduleIndex && (
              <div className="ml-3 mt-1 space-y-1">
                {module.sections.map((section, sectionIndex) => {
                  const sectionCompletedCount = section.quizzes.filter((_, qIndex) =>
                    completedQuizzes.has(`${moduleIndex}-${sectionIndex}-${qIndex}`)
                  ).length;

                  return (
                    <button
                      key={sectionIndex}
                      onClick={() => onSectionSelect(sectionIndex)}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between ${
                        activeSection === sectionIndex
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="flex items-center">
                        {sectionCompletedCount === section.quizzes.length ? (
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                        ) : (
                          <Circle className="w-3 h-3 mr-2" />
                        )}
                        {section.title}
                      </span>
                      <span className="text-xs">
                        {sectionCompletedCount}/{section.quizzes.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 統計情報 */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">学習統計</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">総問題数</span>
            <span className="font-medium">{totalQuizzes}問</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">完了済み</span>
            <span className="font-medium text-green-600">{completedQuizzes.size}問</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">正答率</span>
            <span className="font-medium">
              {completedQuizzes.size > 0 ? Math.round((completedQuizzes.size / totalQuizzes) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}