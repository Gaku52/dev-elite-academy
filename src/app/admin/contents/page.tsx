'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface LearningContent {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  content_type: string;
  content_body: Record<string, unknown>;
  difficulty: string;
  estimated_time: number;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
  progress?: { count: number }[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CONTENT_TYPES = [
  { value: 'VIDEO', label: 'ビデオ' },
  { value: 'ARTICLE', label: '記事' },
  { value: 'QUIZ', label: 'クイズ' },
  { value: 'EXERCISE', label: '演習' },
  { value: 'PROJECT', label: 'プロジェクト' }
];

const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: '初級' },
  { value: 'INTERMEDIATE', label: '中級' },
  { value: 'ADVANCED', label: '上級' },
  { value: 'EXPERT', label: 'エキスパート' }
];

export default function ContentsPage() {
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<LearningContent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [formData, setFormData] = useState({
    categoryId: 0,
    title: '',
    description: '',
    contentType: 'ARTICLE',
    contentBody: {},
    difficulty: 'BEGINNER',
    estimatedTime: 30,
    tags: [] as string[],
    isPublished: false
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchContents = async () => {
    try {
      let url = `/api/admin/contents?page=${pagination.page}&limit=${pagination.limit}`;
      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setContents(data.contents);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/admin/contents';
      const method = editingContent ? 'PUT' : 'POST';
      const body = editingContent 
        ? { ...formData, id: editingContent.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchContents();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleEdit = (content: LearningContent) => {
    setEditingContent(content);
    setFormData({
      categoryId: content.category_id,
      title: content.title,
      description: content.description || '',
      contentType: content.content_type,
      contentBody: content.content_body,
      difficulty: content.difficulty,
      estimatedTime: content.estimated_time,
      tags: content.tags,
      isPublished: content.is_published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このコンテンツを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/admin/contents?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchContents();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const resetForm = () => {
    setEditingContent(null);
    setFormData({
      categoryId: 0,
      title: '',
      description: '',
      contentType: 'ARTICLE',
      contentBody: {},
      difficulty: 'BEGINNER',
      estimatedTime: 30,
      tags: [],
      isPublished: false
    });
    setTagInput('');
    setShowForm(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">学習コンテンツマスタ管理</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          新規追加
        </button>
      </div>

      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">全カテゴリ</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingContent ? 'コンテンツ編集' : '新規コンテンツ'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">カテゴリ *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">選択してください</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">タイトル *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">説明</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">コンテンツタイプ *</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {CONTENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">難易度 *</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">推定時間（分）</label>
                <input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">コンテンツ本文（JSON）</label>
              <textarea
                value={JSON.stringify(formData.contentBody, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, contentBody: parsed });
                  } catch {
                    // Invalid JSON, keep as is
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">タグ</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="タグを入力してEnter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">公開</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                {editingContent ? '更新' : '登録'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイトル</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">難易度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">時間</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">利用数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状態</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{content.id}</td>
                  <td className="px-4 py-3 text-sm">{content.category.name}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{content.title}</div>
                      {content.description && (
                        <div className="text-sm text-gray-600">{content.description}</div>
                      )}
                      {content.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {content.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {CONTENT_TYPES.find(t => t.value === content.content_type)?.label}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {DIFFICULTY_LEVELS.find(d => d.value === content.difficulty)?.label}
                  </td>
                  <td className="px-4 py-3 text-sm">{content.estimated_time}分</td>
                  <td className="px-4 py-3 text-sm">
                    <div>進捗: {content.progress?.[0]?.count || 0}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
                      content.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {content.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                      {content.is_published ? '公開' : '非公開'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(content)}
                        className="p-1 hover:bg-blue-100 rounded text-blue-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              全 {pagination.total} 件中 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    pagination.page === i + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, pagination.page - 3), Math.min(pagination.totalPages, pagination.page + 2))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}