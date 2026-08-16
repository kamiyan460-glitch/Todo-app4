import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTodos } from '@/lib/gasApi';
import type { Todo } from '@/types/todo';

export function TodoListPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTodos()
      .then((data) => {
        if (!cancelled) setTodos(data);
      })
      .catch(() => {
        if (!cancelled) setError('Todoの取得に失敗しました。');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Todo一覧</h1>
        <Link
          to="/todos/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          新規登録
        </Link>
      </div>

      {loading && <p className="mt-6 text-gray-500">読み込み中...</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!loading && !error && sortedTodos.length === 0 && (
        <p className="mt-6 text-gray-500">Todoが登録されていません。</p>
      )}

      {!loading && !error && sortedTodos.length > 0 && (
        <ul className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
          {sortedTodos.map((todo) => (
            <li key={todo.id}>
              <button
                type="button"
                onClick={() => navigate(`/todos/${todo.id}`)}
                className="flex w-full items-center justify-between px-2 py-3 text-left hover:bg-gray-50"
              >
                <span className="text-gray-900">{todo.title}</span>
                <span className="text-sm text-gray-500">{todo.dueDate || '期日未設定'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
