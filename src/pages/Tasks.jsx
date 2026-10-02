import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getStats } from '../utils/taskUtils';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'high', label: 'High priority' },
];

// Tasks is the most "stateful" page in the app. It doesn't own the
// tasks array itself (that lives in App.jsx, passed down as a prop,
// along with the functions to change it) — but it DOES own two pieces
// of local UI state that only matter to this page: the search text
// and which filter pill is selected, plus which task (if any) is
// currently open in the edit modal.
function Tasks({ tasks, onAdd, onToggle, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  const stats = getStats(tasks);

  // Build the visible list by chaining two array methods:
  // filter() keeps only the tasks that match the current filter pill,
  // then a second filter() narrows that down further by the search box.
  const visibleTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      if (filter === 'high') return t.priority === 'high';
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  function handleEditSubmit(updatedFields) {
    onUpdate(editingTask.id, updatedFields);
    setEditingTask(null);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Task management</div>
          <h1>Tasks</h1>
          <div className="page-header__sub">
            {stats.pending} pending · {stats.completed} completed · {stats.total} total
          </div>
        </div>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'start' }}>
        <div>
          <div className="section-title">New task</div>
          <TaskForm onSubmit={onAdd} submitLabel="Add task" />
        </div>

        <div>
          <div className="task-toolbar">
            <div className="task-search">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-pills">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`filter-pill ${filter === f.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <TaskList
            tasks={visibleTasks}
            onToggle={onToggle}
            onEdit={setEditingTask}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* Edit modal: only rendered when editingTask is not null.
          This "conditional rendering" pattern (condition && <JSX />)
          is how React shows/hides things — there's no separate
          show()/hide() call, the JSX simply isn't there when false. */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-panel__header">
              <h3>Edit task</h3>
              <button className="btn btn--icon" onClick={() => setEditingTask(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <TaskForm
              initialTask={{
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate,
              }}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingTask(null)}
              submitLabel="Save changes"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Tasks;
