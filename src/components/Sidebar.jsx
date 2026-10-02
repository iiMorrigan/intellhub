// Sidebar renders the IntelliHub brand mark and the five navigation
// links. It doesn't decide what the "current page" is — App.jsx owns
// that piece of state and passes it down as `activePage`, along with
// `onNavigate`, a function Sidebar calls when a link is clicked.
// This pattern (parent owns the state, child just reports events)
// is one of the most common in React.

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'documents', label: 'Documents' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'assistant', label: 'AI Assistant' },
];

const ICONS = {
  dashboard: (
    <svg className="sidebar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="6" height="8" rx="1.5" />
      <rect x="11" y="3" width="6" height="5" rx="1.5" />
      <rect x="11" y="10" width="6" height="7" rx="1.5" />
      <rect x="3" y="13" width="6" height="4" rx="1.5" />
    </svg>
  ),
  tasks: (
    <svg className="sidebar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M6.5 10l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  documents: (
    <svg className="sidebar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5.5 2.5h6L15 6v11a1 1 0 01-1 1h-8.5a1 1 0 01-1-1v-13a1 1 0 011-1z" />
      <path d="M11.5 2.5V6H15" />
    </svg>
  ),
  analytics: (
    <svg className="sidebar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 17V3" strokeLinecap="round" />
      <path d="M3 17h14" strokeLinecap="round" />
      <rect x="6" y="10" width="2.4" height="5" />
      <rect x="10.5" y="6" width="2.4" height="9" />
      <rect x="15" y="12" width="2" height="3" />
    </svg>
  ),
  assistant: (
    <svg className="sidebar__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 5.5a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H8l-3.5 3v-3H5a2 2 0 01-2-2v-6z" />
      <circle cx="7.5" cy="8.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="8.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="8.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
};

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__mark" />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">IntelliHub</span>
          <span className="sidebar__brand-tag">Productivity Platform</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar__link ${activePage === item.id ? 'is-active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {ICONS[item.id]}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">IntelliHub v0.1 · Frontend MVP</div>
    </aside>
  );
}

export default Sidebar;
