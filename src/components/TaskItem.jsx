import { formatDate, isOverdue } from '../utils/taskUtils';

// TaskItem renders ONE task as a card. It receives the task itself
// plus three functions as props — onToggle, onEdit, onDelete — and
// calls them when the user interacts. TaskItem never changes the
// task list directly; it just reports "the user clicked complete on
// task X" and lets the parent (Tasks.jsx) decide what that means.
// This keeps the data (the tasks array) living in exactly one place.

const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  return (
    <div className={`card task-card ${task.completed ? 'is-completed' : ''}`}>
      <button
        className={`task-checkbox ${task.completed ? 'is-checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="task-card__body">
        <div className="task-card__top">
          <span className="task-card__title">{task.title}</span>
          <span className={`badge badge--${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
        </div>

        {task.description && <p className="task-card__desc">{task.description}</p>}

        <div className="task-card__meta">
          {task.dueDate && (
            <span className={overdue ? 'is-overdue' : ''}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.completed && task.completedAt && <span>Completed {formatDate(task.completedAt)}</span>}
        </div>
      </div>

      <div className="task-card__actions">
        <button className="btn btn--icon" onClick={() => onEdit(task)} aria-label="Edit task">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 2l3 3-8 8-3.5 1 1-3.5 8-8z" />
          </svg>
        </button>
        <button className="btn btn--icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8.5a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
