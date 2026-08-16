import type { Todo, TodoInput } from '@/types/todo';

const GAS_API_URL = import.meta.env.VITE_GAS_API_URL;

function ensureConfigured() {
  if (!GAS_API_URL) {
    throw new Error(
      'GASのWebアプリURLが設定されていません。.envのVITE_GAS_API_URLを設定してください。'
    );
  }
}

export async function fetchTodos(): Promise<Todo[]> {
  ensureConfigured();
  const res = await fetch(GAS_API_URL);
  if (!res.ok) {
    throw new Error('Todoの取得に失敗しました。');
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('取得したデータの形式が正しくありません。');
  }
  return data as Todo[];
}

export async function saveTodo(input: TodoInput): Promise<Todo> {
  ensureConfigured();
  const res = await fetch(GAS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error('Todoの保存に失敗しました。');
  }
  const data = await res.json();
  if (!data || typeof data !== 'object' || !('id' in data)) {
    throw new Error('保存結果の形式が正しくありません。');
  }
  return data as Todo;
}
