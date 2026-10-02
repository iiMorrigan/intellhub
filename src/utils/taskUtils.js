// Small, focused helper functions used across the Dashboard, Tasks
// and Analytics pages. Keeping this logic here (instead of copy-pasting
// it into every page) means each page component only has to describe
// WHAT to show, not HOW to compute it.

export function getStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  return { total, completed, pending, highPriority };
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

export function isDueToday(task) {
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate === today;
}

export function getUpcomingDeadlines(tasks, withinDays = 7) {
  const today = new Date();
  const limit = new Date();
  limit.setDate(today.getDate() + withinDays);

  return tasks
    .filter((t) => !t.completed && t.dueDate)
    .filter((t) => {
      const due = new Date(t.dueDate + 'T00:00:00');
      return due >= new Date(today.toISOString().slice(0, 10) + 'T00:00:00') && due <= limit;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function getPriorityBreakdown(tasks) {
  return {
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length,
  };
}

// Builds a 7-day trend of how many tasks were completed each day,
// for the Analytics page's bar chart.
export function getCompletionTrend(tasks, days = 7) {
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = tasks.filter((t) => t.completedAt === key).length;
    buckets.push({ key, label, count });
  }
  return buckets;
}
