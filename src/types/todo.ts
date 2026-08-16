export interface Todo {
  id: string;
  title: string;
  content: string;
  dueDate: string;
}

export type TodoInput = Omit<Todo, 'id'> & { id?: string };
