import { FormEvent, useEffect, useState } from 'react';
import type { Todo } from '@/types/todo';

export interface TodoFormValues {
  title: string;
  content: string;
  dueDate: string;
}

interface TodoFormProps {
  initialValue?: Todo | null;
  onSubmit: (values: TodoFormValues) => void;
  submitting: boolean;
}

export function TodoForm({ initialValue, onSubmit, submitting }: TodoFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [content, setContent] = useState(initialValue?.content ?? '');
  const [dueDate, setDueDate] = useState(initialValue?.dueDate ?? '');
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialValue?.title ?? '');
    setContent(initialValue?.content ?? '');
    setDueDate(initialValue?.dueDate ?? '');
  }, [initialValue]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('タイトルを入力してください。');
      return;
    }
    setTitleError(null);
    onSubmit({ title: trimmedTitle, content, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        {titleError && <p className="mt-1 text-sm text-red-600">{titleError}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          期日
        </label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? '保存中...' : '保存する'}
      </button>
    </form>
  );
}
