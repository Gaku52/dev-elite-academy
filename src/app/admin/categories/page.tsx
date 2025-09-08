'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';

interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  contents?: { count: number }[];
  study_plans?: { count: number }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#000000',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory 
        ? { ...formData, id: editingCategory.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchCategories();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#000000',
      sortOrder: category.sort_order,
      isActive: category.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このカテゴリを削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#000000',
      sortOrder: 0,
      isActive: true
    });
    setShowForm(false);
  };

  const updateSortOrder = async (category: Category, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === category.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const targetCategory = categories[targetIndex];
    
    try {
      await Promise.all([
        fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: category.id,
            sortOrder: targetCategory.sort_order
          })
        }),
        fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetCategory.id,
            sortOrder: category.sort_order
          })
        })
      ]);
      
      fetchCategories();
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">カテゴリマスタ管理</h1>
            <p className="text-gray-300">学習カテゴリの作成・編集・管理を行います</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            新規追加
          </button>
        </div>

        {showForm && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm p-6 rounded-lg border border-slate-600/30 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              {editingCategory ? 'カテゴリ編集' : '新規カテゴリ'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">カテゴリ名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">表示順</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">説明</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">アイコン</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="📚"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">カラー</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-purple-500 focus:ring-purple-500/20"
                  />
                  <span className="text-sm font-medium text-gray-300">有効</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {editingCategory ? '更新' : '登録'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-all duration-300"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
        )}

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">順序</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">カテゴリ名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">説明</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">コンテンツ数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">状態</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600/30">
                {categories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-slate-700/30 text-white transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateSortOrder(category, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-slate-600 rounded disabled:opacity-30 text-gray-300"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => updateSortOrder(category, 'down')}
                        disabled={index === categories.length - 1}
                        className="p-1 hover:bg-slate-600 rounded disabled:opacity-30 text-gray-300"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <span className="ml-2">{category.sort_order}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span className="font-medium text-white">{category.name}</span>
                      {category.color && (
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {category.description || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-1 text-gray-300">
                      <div>コンテンツ: {category.contents?.[0]?.count || 0}</div>
                      <div>学習計画: {category.study_plans?.[0]?.count || 0}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.is_active 
                        ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                        : 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {category.is_active ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 hover:bg-blue-600/20 rounded text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 hover:bg-red-600/20 rounded text-red-400 hover:text-red-300"
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
        </div>
      </div>
    </div>
  );
}