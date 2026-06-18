import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/index.js'
import { statusBadge, priorityBadge, fmtDate } from '../utils.js'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.projects.get(id).then(setProject).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>
  if (!project) return <div className="page-body"><p className="muted mono" style={{ fontSize: 12 }}>project not found.</p></div>

  const [pCls, pLabel] = statusBadge(project.status)

  return (
    <>
      <div className="page-header">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', marginBottom: 4 }}>
            <Link to="/projects">← projects</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2>{project.name}</h2>
            <span className={`badge ${pCls}`}>{pLabel.toLowerCase()}</span>
          </div>
          {project.description && (
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink3)', marginTop: 3 }}>
              {project.description}
            </p>
          )}
        </div>
        {project.repositoryUrl && (
          <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            repo ↗
          </a>
        )}
      </div>
      <hr className="page-divider" />

      <div className="page-body">
        <div className="two-col">
          <div>
            <div className="section-head">
              <span className="section-label">tasks ({project.tasks?.length})</span>
            </div>
            {!project.tasks?.length ? (
              <p className="mono muted" style={{ fontSize: 11 }}>no tasks.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>title</th><th>status</th><th>priority</th><th>due</th></tr></thead>
                  <tbody>
                    {project.tasks.map((t) => {
                      const [sc, sl] = statusBadge(t.status)
                      const [pc, pl] = priorityBadge(t.priority)
                      return (
                        <tr key={t.id}>
                          <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{t.title}</td>
                          <td><span className={`badge ${sc}`}>{sl.toLowerCase()}</span></td>
                          <td><span className={`badge ${pc}`}>{pl.toLowerCase()}</span></td>
                          <td className="muted mono" style={{ fontSize: 11 }}>{fmtDate(t.dueDate)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="section-head">
              <span className="section-label">links ({project.links?.length})</span>
            </div>
            {!project.links?.length ? (
              <p className="mono muted" style={{ fontSize: 11 }}>no links.</p>
            ) : (
              <div className="row-list">
                {project.links.map((l) => (
                  <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="row-item">
                    <div>
                      <div className="row-title">{l.title}</div>
                      <div className="row-sub truncate" style={{ maxWidth: 220 }}>{l.url}</div>
                    </div>
                    <span className="row-meta">↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
