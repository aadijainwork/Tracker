import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/index.js'
import { statusBadge, fmtDate, PROJECT_STATUSES } from '../utils.js'
import Modal from '../components/ui/Modal.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', description: '', repositoryUrl: '', status: 'ACTIVE', ...initial,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim()) return setErr('name is required')
    setSaving(true)
    try { await onSave(form) }
    catch (e) { setErr(e.message); setSaving(false) }
  }

  return (
    <>
      {err && <div className="error-box">{err}</div>}
      <div className="form-group">
        <label>name *</label>
        <input type="text" value={form.name} onChange={set('name')} placeholder="auth-service-refactor" />
      </div>
      <div className="form-group">
        <label>description</label>
        <textarea value={form.description || ''} onChange={set('description')} placeholder="what is this project about?" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>repo url</label>
          <input type="url" value={form.repositoryUrl || ''} onChange={set('repositoryUrl')} placeholder="https://github.com/..." />
        </div>
        <div className="form-group">
          <label>status</label>
          <select value={form.status} onChange={set('status')}>
            {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          {saving ? 'saving...' : 'save'}
        </button>
      </div>
    </>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  const load = () => {
    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    return api.projects
      .list({
        ownerId: currentUser.id
      })
      .then(setProjects)
      .finally(() =>
        setLoading(false)
      );
  }
  useEffect(() => { load() }, [])

  const handleCreate = async (d) => {

  const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    await api.projects.create({
      ...d,
      ownerId: currentUser.id
    });

    await load();

    setModal(null);
  }
  const handleUpdate = async (d) => { await api.projects.update(modal.edit.id, d); await load(); setModal(null) }
  const handleDelete = async ()  => { await api.projects.delete(modal.del.id); await load(); setModal(null) }

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h2>projects</h2>
          <p>{projects.length} total</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>+ new</button>
      </div>
      <hr className="page-divider" />

      <div className="page-body">
        {projects.length === 0 ? (
          <div className="empty-state">
            <h3>no projects yet</h3>
            <p>create a project to start tracking tasks and links.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>create project</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>name</th><th>status</th><th>repo</th><th>tasks</th><th>created</th><th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const [cls, label] = statusBadge(p.status)
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/projects/${p.id}`} style={{ fontWeight: 'bold', fontFamily: 'var(--mono)', fontSize: 12 }}>
                          {p.name}
                        </Link>
                        {p.description && (
                          <div className="truncate muted" style={{ fontSize: 11, maxWidth: 260, marginTop: 1 }}>
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td><span className={`badge ${cls}`}>{label.toLowerCase()}</span></td>
                      <td>
                        {p.repositoryUrl
                          ? <a href={p.repositoryUrl} target="_blank" rel="noreferrer" className="mono" style={{ fontSize: 11 }}>
                              {p.repositoryUrl.replace('https://github.com/', 'gh/')}
                            </a>
                          : <span className="muted mono" style={{ fontSize: 11 }}>—</span>}
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{p._count?.tasks ?? 0}</td>
                      <td className="muted mono" style={{ fontSize: 11 }}>{fmtDate(p.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setModal({ edit: p })}>edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setModal({ del: p })}>del</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal === 'create' && <Modal title="new project" onClose={() => setModal(null)}><ProjectForm onSave={handleCreate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.edit && <Modal title="edit project" onClose={() => setModal(null)}><ProjectForm initial={modal.edit} onSave={handleUpdate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.del && <ConfirmDialog message={`delete "${modal.del.name}"? tasks and links will be unlinked.`} onConfirm={handleDelete} onCancel={() => setModal(null)} />}
    </>
  )
}
