import { getStats, getPriorityBreakdown, getCompletionTrend } from '../utils/taskUtils';

// Analytics reads the same tasks array as Dashboard and Tasks, but
// summarizes it differently. All three pages share one source of
// truth (the tasks array in App.jsx) — this is what people mean by
// "data flows down" in React: one array, many views of it.
function Analytics({ tasks }) {
  const stats = getStats(tasks);
  const priorities = getPriorityBreakdown(tasks);
  const trend = getCompletionTrend(tasks, 7);
  const maxTrend = Math.max(...trend.map((d) => d.count), 1);
  const total = stats.total || 1;

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Insights</div>
          <h1>Analytics</h1>
          <div className="page-header__sub">A snapshot of how your work is trending, based on your task data.</div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card" style={{ padding: 22 }}>
          <div className="section-title">Completed vs. pending</div>
          <div className="bar-row">
            <span className="bar-row__label">Completed</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill"
                style={{ width: `${(stats.completed / total) * 100}%`, background: 'var(--color-success)' }}
              />
            </div>
            <span className="bar-row__value">{stats.completed}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">Pending</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill"
                style={{ width: `${(stats.pending / total) * 100}%`, background: 'var(--color-info)' }}
              />
            </div>
            <span className="bar-row__value">{stats.pending}</span>
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div className="section-title">Tasks by priority</div>
          <div className="bar-row">
            <span className="bar-row__label">High</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill"
                style={{ width: `${(priorities.high / total) * 100}%`, background: 'var(--color-danger)' }}
              />
            </div>
            <span className="bar-row__value">{priorities.high}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">Medium</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill"
                style={{ width: `${(priorities.medium / total) * 100}%`, background: 'var(--color-accent)' }}
              />
            </div>
            <span className="bar-row__value">{priorities.medium}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">Low</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill"
                style={{ width: `${(priorities.low / total) * 100}%`, background: 'var(--color-info)' }}
              />
            </div>
            <span className="bar-row__value">{priorities.low}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div className="section-title">Tasks completed — last 7 days</div>
        <div className="trend-chart">
          {trend.map((day) => (
            <div className="trend-col" key={day.key}>
              <div
                className="trend-col__bar"
                style={{ height: `${(day.count / maxTrend) * 100}%` }}
                title={`${day.count} completed`}
              />
              <span className="trend-col__label">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Analytics;
