import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/index.js'
import { fmtDate, statusBadge } from '../utils.js'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.dashboard.get().then(setData).finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>

  const { taskStats: s, recentMeetings, activeProjects, teamTasks } = data || {}

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">{today.toLowerCase()}</div>
        </div>
        <Link to="/tasks" className="btn btn-primary btn-sm">+ new task</Link>
      </div>

      <div className="page-body">

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card amber">
            <div className="stat-card-accent" />
            <div className="stat-label">Open</div>
            <div className="stat-value">{s?.openTasks ?? 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-accent" />
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{s?.inProgressTasks ?? 0}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-card-accent" />
            <div className="stat-label">Blocked</div>
            <div className="stat-value">{s?.blockedTasks ?? 0}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-card-accent" />
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{s?.overdueTasks ?? 0}</div>
          </div>
        </div>

        {/* Projects + Meetings */}
        <div className="two-col" style={{ marginBottom: 20 }}>
          <div>
            <div className="section-header">
              <span className="section-title">Active Projects</span>
              <Link to="/projects" className="btn btn-ghost btn-sm">all →</Link>
            </div>
            {!activeProjects?.length ? (
              <div className="panel">
                <div className="panel-row"><span className="muted" style={{ fontSize: 13 }}>No active projects.</span></div>
              </div>
            ) : (
              <div className="panel">
                {activeProjects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} className="panel-row">
                    <div>
                      <div className="panel-row-title">{p.name}</div>
                      <div className="panel-row-sub">{p._count?.tasks ?? 0} tasks</div>
                    </div>
                    <span className="badge badge-green">active</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="section-header">
              <span className="section-title">Recent Meetings</span>
              <Link to="/meetings" className="btn btn-ghost btn-sm">all →</Link>
            </div>
            {!recentMeetings?.length ? (
              <div className="panel">
                <div className="panel-row"><span className="muted" style={{ fontSize: 13 }}>No meetings yet.</span></div>
              </div>
            ) : (
              <div className="panel">
                {recentMeetings.map((m) => (
                  <Link key={m.id} to="/meetings" className="panel-row">
                    <div>
                      <div className="panel-row-title">{m.title}</div>
                      <div className="panel-row-sub">{fmtDate(m.meetingDate)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team Tasks */}
        <div className="section-header">
          <span className="section-title">Team Tasks</span>
          <Link to="/tasks" className="btn btn-ghost btn-sm">all →</Link>
        </div>
        {!teamTasks?.length ? (
          <div className="panel">
            <div className="panel-row"><span className="muted" style={{ fontSize: 13 }}>No tasks yet.</span></div>
          </div>
        ) : (
          <div className="panel">
            {teamTasks.map((t) => {
              const [cls, label] = statusBadge(t.status)
              return (
                <div key={t.id} className="panel-row">
                  <div>
                    <div className="panel-row-title">{t.title}</div>
                    <div className="panel-row-sub">
                      {t.assignee?.name || 'Unassigned'}{t.project ? ` · ${t.project.name}` : ''}
                    </div>
                  </div>
                  <span className={`badge ${cls}`}>{label}</span>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </>
  )
}
