import { NavLink } from 'react-router-dom'

const NAV = [
  {
    to: '/', label: 'Dashboard', exact: true,
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    to: '/projects', label: 'Projects',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
  },
  {
    to: '/tasks', label: 'Tasks',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
  },
  {
    to: '/meetings', label: 'Meetings',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  },
  {
    to: '/links', label: 'Links',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  },
]

export default function Sidebar() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const initials = currentUser?.name?.slice(0, 2).toUpperCase() || '??'

  const handleSwitch = () => {
    localStorage.removeItem('currentUser')
    window.location.reload()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">Engineering Hub</div>
          <div className="sidebar-brand-sub">personal workspace</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV.map(({ to, label, icon, exact }) => (
          <NavLink
            key={to} to={to} end={exact}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        {currentUser && (
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser.name}</div>
              <div className="sidebar-user-role">Engineer</div>
            </div>
          </div>
        )}
        <button className="sidebar-switch-btn" onClick={handleSwitch}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Switch User
        </button>
      </div>
    </aside>
  )
}
