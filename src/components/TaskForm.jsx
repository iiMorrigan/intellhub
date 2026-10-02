import { useState } from 'react';

// TaskForm is used in two places: inline on the Tasks page (to create
// a new task) and inside a modal (to edit an existing one). Rather than
// writing two separate forms, this ONE component handles both — if it
// receives an `initialTask` prop it starts pre-filled, otherwise it
// starts empty. `onSubmit` is called with the finished task data;
// the parent component decides whether that means "add" or "update".

const emptyTask = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

function TaskForm({ initialTask, onSubmit, onCancel, submitLabel = 'Add task' }) {
  // useState here holds all four form fields together in one object,
  // instead of four separate useState calls. We update one field at a
  // time with the spread operator (`...form`), which copies the existing
  // fields and overrides just the one that changed.
  const [form, setForm] = useState(initialTask || emptyTask);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    if (!form.title.trim()) return;
    onSubmit(form);
    if (!initialTask) setForm(emptyTask); // reset after creating a new task
  }

  return (
    <form className="card" style={{ padding: 20 }} onSubmit={handleSubmit}>
      <div className="field" style={{ marginBottom: 14 }}>
        <label htmlFor="title">Task title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Finish analytics page"
          autoComplete="off"
        />
      </div>

      <div className="field" style={{ marginBottom: 14 }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details about this task"
        />
      </div>

      <div className="modal-panel__form-row" style={{ marginBottom: 18 }}>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
