import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',         label: '~/',       exact: true },
  { to: '/projects', label: 'projects/' },
  { to: '/tasks',    label: 'tasks/'    },
  { to: '/meetings', label: 'meetings/' },
  { to: '/links',    label: 'links/'    },
]

export default function Sidebar() {

  const currentUser =
  localStorage.getItem(
    "currentUser"
  );
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>eng-hub</h1>
        <span>personal / local</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">

        <div
          style={{
            marginBottom: "12px"
          }}
        >

          <div
            style={{
              color: "var(--ink4)"
            }}
          >
            Current User
          </div>

          <div
            style={{
              fontWeight: "600"
            }}
          >
            {currentUser}
          </div>

        </div>

        <button
          onClick={() => {

            localStorage.removeItem(
              "currentUser"
            );

            window.location.reload();

          }}
        >
          Switch User
        </button>

        <div
          style={{
            marginTop: "16px"
          }}
        >
          :5173 / api :3001
        </div>

        <div
          style={{
            color: "var(--ink4)",
            marginTop: "1px"
          }}
        >
          sqlite · prisma
        </div>

      </div>
    </aside>
  )
}
