import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TodoListPage } from '@/pages/TodoListPage';
import { TodoFormPage } from '@/pages/TodoFormPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<TodoListPage />} />
          <Route path="/todos/:id" element={<TodoFormPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
