'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

interface Todo {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

const APP_VERSION = '1.0.0';

export default function Home() {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'name'>('time');
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Temporarily disabled for testing
    // if (!loading && !user) {
    //   router.push('/login');
    // }
  }, [user, loading, router]);

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      const parsed = JSON.parse(saved).map((t: Todo) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      }));
      setTodos(parsed);
    }
  }, []);

  // Save vào localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        content: input,
        completed: false,
        createdAt: new Date()
      };
      setTodos([newTodo, ...todos]);
      setInput('');
    }
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const saveEdit = (id: string) => {
    if (editingContent.trim()) {
      setTodos(todos.map(t =>
        t.id === id ? { ...t, content: editingContent } : t
      ));
      setEditingId(null);
      setEditingContent('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Lọc công việc
  let filteredTodos = todos.filter(todo => {
    const matchSearch = todo.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? todo.completed :
      !todo.completed;
    return matchSearch && matchFilter;
  });

  // Sắp xếp
  filteredTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return a.content.localeCompare(b.content);
    }
  });

  if (false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (false) {
    return null;
  }

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              📝 Todo Task Manager
            </h1>
            <p className="text-sm text-gray-500 mt-1">v{APP_VERSION}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-gray-600">{user?.email || 'Chưa đăng nhập'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
            >
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Tổng công việc</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Đã hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm">Chưa làm</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          {/* Add Todo */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thêm công việc mới</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập nội dung công việc..."
                className="flex-1 border-2 border-gray-300 p-3 rounded-lg text-black focus:border-blue-500 focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <button
                onClick={addTodo}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-md"
              >
                ➕ Thêm
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tìm kiếm & Lọc</h2>
            <div className="space-y-3">
              {/* Search */}
              <input
                type="text"
                placeholder="🔍 Tìm kiếm công việc..."
                className="w-full border-2 border-gray-300 p-3 rounded-lg text-black focus:border-blue-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Filter & Sort */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="w-full border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">📋 Tất cả</option>
                    <option value="completed">✅ Đã hoàn thành</option>
                    <option value="pending">⏳ Chưa làm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full border-2 border-gray-300 p-2 rounded-lg text-black focus:border-blue-500 focus:outline-none"
                  >
                    <option value="time">⏰ Thời gian (mới nhất)</option>
                    <option value="name">🔤 Tên A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Danh sách công việc ({filteredTodos.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">
                    {todos.length === 0 ? '📭 Chưa có công việc nào' : '🔍 Không tìm thấy công việc phù hợp'}
                  </p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-4 rounded-lg border-2 transition duration-200 ${
                      todo.completed
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200 hover:border-blue-400'
                    }`}
                  >
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="flex-1 border-2 border-gray-300 p-2 rounded text-black focus:border-blue-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-semibold"
                        >
                          💾 Lưu
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded font-semibold"
                        >
                          ❌ Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleComplete(todo.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition duration-200 ${
                            todo.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {todo.completed && <span className="text-white">✓</span>}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`text-black ${
                              todo.completed
                                ? 'line-through text-gray-500'
                                : 'font-medium'
                            }`}
                          >
                            {todo.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            📅 {todo.createdAt.toLocaleDateString('vi-VN')} {todo.createdAt.toLocaleTimeString('vi-VN')}
                          </p>
                        </div>
                        <button
                          onClick={() => startEdit(todo.id, todo.content)}
                          className="text-blue-500 hover:text-blue-700 px-3 py-2 font-semibold"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => removeTodo(todo.id)}
                          className="text-red-500 hover:text-red-700 px-3 py-2 font-semibold"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Summary */}
            {todos.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  Hiển thị {filteredTodos.length} trong {todos.length} công việc
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 text-gray-600 text-sm">
        <p>v{APP_VERSION} • AI-powered Todo Manager</p>
      </footer>
    </div>
  );
}