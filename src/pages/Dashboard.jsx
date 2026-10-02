import StatCard from '../components/StatCard';
import { getStats, getUpcomingDeadlines, isDueToday, formatDate } from '../utils/taskUtils';

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const ICONS = {
  total: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="2" width="12" height="12" rx="2.5" />
    </svg>
  ),
  success: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pending: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 2" strokeLinecap="round" />
    </svg>
  ),
  danger: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 2l6.5 11.5h-13L8 2z" strokeLinejoin="round" />
      <path d="M8 6.5v3.2" strokeLinecap="round" />
      <circle cx="8" cy="11.7" r="0.3" fill="currentColor" />
    </svg>
  ),
};

// Dashboard is a "read-only" page — it receives the tasks array as a
// prop and derives everything else (stats, today's tasks, deadlines)
// from it using the helper functions in taskUtils.js. It never
// modifies the tasks itself.
function Dashboard({ tasks }) {
  const stats = getStats(tasks);
  const todaysTasks = tasks.filter((t) => !t.completed && isDueToday(t));
  const upcoming = getUpcomingDeadlines(tasks, 7).slice(0, 5);
  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">{todayLabel}</div>
          <h1>Welcome back</h1>
          <div className="page-header__sub">Here's what's happening across your workspace today.</div>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total tasks" value={stats.total} tone="primary" icon={ICONS.total} note="All active & completed" />
        <StatCard label="Completed" value={stats.completed} tone="success" icon={ICONS.success} note={`${completionRate}% completion rate`} />
        <StatCard label="Pending" value={stats.pending} tone="info" icon={ICONS.pending} note="Still in progress" />
        <StatCard label="High priority" value={stats.highPriority} tone="danger" icon={ICONS.danger} note="Needs attention" />
      </div>

      <div className="dash-grid">
        <div className="dash-col">
          <div className="card" style={{ padding: 20 }}>
            <div className="section-title">Today's tasks</div>
            {todaysTasks.length === 0 ? (
              <div className="empty-state">Nothing due today. Enjoy the breathing room.</div>
            ) : (
              todaysTasks.map((t) => (
                <div className="list-row" key={t.id}>
                  <span
                    className="list-row__dot"
                    style={{
                      background:
                        t.priority === 'high'
                          ? 'var(--color-danger)'
                          : t.priority === 'medium'
                          ? 'var(--color-accent)'
                          : 'var(--color-info)',
                    }}
                  />
                  <div className="list-row__body">
                    <div className="list-row__title">{t.title}</div>
                    <div className="list-row__meta">Due today · {t.priority} priority</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="section-title">Productivity overview</div>
            <div className="list-row" style={{ border: 'none', paddingTop: 0 }}>
              <div className="list-row__body">
                <div className="list-row__meta" style={{ marginBottom: 8 }}>
                  Completion rate across all tasks
                </div>
                <div className="bar-row" style={{ marginBottom: 0 }}>
                  <div className="bar-row__track">
                    <div
                      className="bar-row__fill"
                      style={{ width: `${completionRate}%`, background: 'var(--color-success)' }}
                    />
                  </div>
                  <div className="bar-row__value">{completionRate}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-col">
          <div className="card" style={{ padding: 20 }}>
            <div className="section-title">Upcoming deadlines</div>
            {upcoming.length === 0 ? (
              <div className="empty-state">No deadlines in the next 7 days.</div>
            ) : (
              upcoming.map((t) => (
                <div className="list-row" key={t.id}>
                  <div className="list-row__body">
                    <div className="list-row__title">{t.title}</div>
                    <div className="list-row__meta">{formatDate(t.dueDate)}</div>
                  </div>
                  <span className={`badge badge--${t.priority}`}>{t.priority}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
