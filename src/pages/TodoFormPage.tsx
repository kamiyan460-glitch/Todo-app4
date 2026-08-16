import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TodoForm, type TodoFormValues } from '@/components/TodoForm';
import { fetchTodos, saveTodo } from '@/lib/gasApi';
import type { Todo } from '@/types/todo';

export function TodoFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isNew) {
      setTodo(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetchTodos()
      .then((todos) => {
        if (cancelled) return;
        const found = todos.find((t) => t.id === id) ?? null;
        if (!found) {
          setNotFound(true);
        }
        setTodo(found);
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
  }, [id, isNew]);

  const handleSubmit = async (values: TodoFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await saveTodo(isNew ? values : { ...values, id });
      navigate('/');
    } catch {
      setError('保存に失敗しました。');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
        &larr; 一覧に戻る
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-gray-900">
        {isNew ? 'Todoの新規登録' : 'Todoの編集'}
      </h1>

      {loading && <p className="mt-6 text-gray-500">読み込み中...</p>}
      {!loading && notFound && (
        <p className="mt-6 text-red-600">指定されたTodoが見つかりませんでした。</p>
      )}
      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!loading && (isNew || todo) && (
        <div className="mt-6">
          <TodoForm key={id} initialValue={todo} onSubmit={handleSubmit} submitting={submitting} />
        </div>
      )}
    </div>
  );
}
