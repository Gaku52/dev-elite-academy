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
    color: '#8E9C78',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('supabase-auth-token');
      const response = await fetch('/api/admin/categories', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      const data = await response.json();
      if (response.status === 401) {
        console.error('Authentication required');
        return;
      }
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
      const token = localStorage.getItem('supabase-auth-token');
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { ...formData, id: editingCategory.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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
      color: category.color || '#8E9C78',
      sortOrder: category.sort_order,
      isActive: category.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('このカテゴリを削除してもよろしいですか？')) return;

    try {
      const token = localStorage.getItem('supabase-auth-token');
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
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
      color: '#8E9C78',
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
      const token = localStorage.getItem('supabase-auth-token');
      await Promise.all([
        fetch('/api/admin/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            id: category.id,
            sortOrder: targetCategory.sort_order
          })
        }),
        fetch('/api/admin/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-muted text-xl">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-20">
        <div className="container-modern">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">カテゴリマスタ管理</h1>
              <p className="text-xl text-muted">学習カテゴリの作成・編集・管理を行います</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-modern flex items-center gap-2 text-lg px-6 py-3"
            >
              <Plus size={20} />
              新規追加
            </button>
          </div>

          {showForm && (
            <div className="card-modern p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {editingCategory ? 'カテゴリ編集' : '新規カテゴリ'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">カテゴリ名 *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-2xl text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">表示順</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-border rounded-2xl text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">説明</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-2xl text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">アイコン</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-2xl text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                      placeholder="📚"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">カラー</label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-12 border border-border rounded-2xl cursor-pointer bg-background"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 text-primary border-border rounded focus:ring-primary bg-background"
                      />
                      <span className="text-sm font-medium text-foreground">有効</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="btn-modern"
                  >
                    {editingCategory ? '更新' : '登録'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card-modern overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card dark:bg-card border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">順序</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">カテゴリ名</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">説明</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">コンテンツ数</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">状態</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-card dark:hover:bg-card transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateSortOrder(category, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-primary/10 rounded-lg disabled:opacity-30 text-muted hover:text-primary transition-all"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => updateSortOrder(category, 'down')}
                            disabled={index === categories.length - 1}
                            className="p-1 hover:bg-primary/10 rounded-lg disabled:opacity-30 text-muted hover:text-primary transition-all"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <span className="ml-2 text-foreground font-medium">{category.sort_order}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {category.icon && <span className="text-2xl">{category.icon}</span>}
                          <span className="font-semibold text-foreground">{category.name}</span>
                          {category.color && (
                            <div
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {category.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        <div className="space-y-1 text-sm">
                          <div>コンテンツ: {category.contents?.[0]?.count || 0}</div>
                          <div>学習計画: {category.study_plans?.[0]?.count || 0}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                          category.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-card dark:bg-card text-muted'
                        }`}>
                          {category.is_active ? '有効' : '無効'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-2 hover:bg-primary/10 rounded-xl text-primary hover:text-primary/80 transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl text-red-500 hover:text-red-600 transition-all"
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
      </section>
    </div>
  );
}