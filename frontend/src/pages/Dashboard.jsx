import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/index.js'
import { fmtDate } from '../utils.js'

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
          <h2>dashboard</h2>
          <p>{today.toLowerCase()}</p>
        </div>
        <Link to="/tasks" className="btn btn-primary btn-sm">+ new task</Link>
      </div>
      <hr className="page-divider" />

      <div className="page-body">
        <div className="stats-row" style={{ marginBottom: 28 }}>
          <div className="stat-cell warn">
            <div className="stat-label">open</div>
            <div className="stat-num">{s?.openTasks ?? 0}</div>
          </div>
          <div className="stat-cell">
            <div className="stat-label">in progress</div>
            <div className="stat-num">{s?.inProgressTasks ?? 0}</div>
          </div>
          <div className="stat-cell bad">
            <div className="stat-label">blocked</div>
            <div className="stat-num">{s?.blockedTasks ?? 0}</div>
          </div>
          <div className="stat-cell good">
            <div className="stat-label">overdue</div>
            <div className="stat-num">{s?.overdueTasks ?? 0}</div>
          </div>
        </div>

        <div className="two-col">
          <div>
            <div className="section-head">
              <span className="section-label">active projects</span>
              <Link to="/projects" className="btn btn-ghost btn-sm">all →</Link>
            </div>
            {!activeProjects?.length ? (
              <p className="mono muted" style={{ fontSize: 11 }}>no active projects.</p>
            ) : (
              <div className="row-list">
                {activeProjects.map((p) => (
                  <Link key={p.id} to={`/projects/${p.id}`} className="row-item">
                    <div>
                      <div className="row-title">{p.name}</div>
                      <div className="row-sub">{p._count?.tasks ?? 0} tasks</div>
                    </div>
                    <span className="row-meta">active</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="section-head">
              <span className="section-label">recent meetings</span>
              <Link to="/meetings" className="btn btn-ghost btn-sm">all →</Link>
            </div>
            {!recentMeetings?.length ? (
              <p className="mono muted" style={{ fontSize: 11 }}>no meetings yet.</p>
            ) : (
              <div className="row-list">
                {recentMeetings.map((m) => (
                  <Link key={m.id} to="/meetings" className="row-item">
                    <div>
                      <div className="row-title">{m.title}</div>
                      <div className="row-sub">{fmtDate(m.meetingDate)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
          <div style={{ marginTop: 30 }}>
          <div className="section-head">
            <span className="section-label">
              team tasks
            </span>
          </div>

          {!teamTasks?.length ? (
            <p className="mono muted">
              no tasks.
            </p>
          ) : (
            <div className="row-list">
              {teamTasks.map((t) => (
                <div
                  key={t.id}
                  className="row-item"
                >
                  <div>
                    <div className="row-title">
                      {t.title}
                    </div>

                    <div className="row-sub">
                      {t.assignee?.name || "Unassigned"}
                      {t.project
                        ? ` • ${t.project.name}`
                        : ""}
                    </div>
                  </div>

                  <span className="row-meta">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
