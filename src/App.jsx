import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import Analytics from './pages/Analytics';
import Assistant from './pages/Assistant';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sampleTasks, sampleDocuments } from './data/sampleData';
import { getStats } from './utils/taskUtils';

// App.jsx is the top of the component tree. It owns two important
// pieces of state that many pages need to share:
//   1. `activePage` — which screen is currently visible
//   2. `tasks` / `documents` — the actual application data
//
// Keeping this data here (instead of inside Dashboard or Tasks
// individually) is called "lifting state up". It means Dashboard,
// Tasks and Analytics can all read and update the SAME tasks array,
// so a task you complete on the Tasks page instantly updates the
// Dashboard's stats too.
function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [tasks, setTasks] = useLocalStorage('intellihub_tasks', sampleTasks);
  const [documents, setDocuments] = useLocalStorage('intellihub_documents', sampleDocuments);

  const today = () => new Date().toISOString().slice(0, 10);

  function addTask(formData) {
    const newTask = {
      id: `t${Date.now()}`,
      ...formData,
      completed: false,
      createdAt: today(),
      completedAt: null,
    };
    // We never write tasks.push(newTask) — React needs a brand NEW
    // array reference to know something changed, so we build one with
    // the spread operator: "all the old tasks, plus this new one".
    setTasks((prev) => [newTask, ...prev]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? today() : null }
          : t
      )
    );
  }

  function updateTask(id, updatedFields) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function addDocument(doc) {
    setDocuments((prev) => [doc, ...prev]);
  }

  function updateDocument(id, updatedFields) {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d)));
  }

  const stats = getStats(tasks);

  // This function decides which page component to render based on
  // `activePage`. It's a plain if/else chain (via a switch statement) —
  // nothing React-specific here, just regular JavaScript control flow
  // that happens to return JSX.
  function renderPage() {
    switch (activePage) {
      case 'tasks':
        return <Tasks tasks={tasks} onAdd={addTask} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />;
      case 'documents':
        return <Documents documents={documents} onUpload={addDocument} onUpdateDocument={updateDocument} />;
      case 'analytics':
        return <Analytics tasks={tasks} />;
      case 'assistant':
        return <Assistant stats={stats} />;
      case 'dashboard':
      default:
        return <Dashboard tasks={tasks} />;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-area">{renderPage()}</main>
    </div>
  );
}

export default App;
