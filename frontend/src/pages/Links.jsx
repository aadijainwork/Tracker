import { useEffect, useState } from 'react'
import { api } from '../api/index.js'
import Modal from '../components/ui/Modal.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'

function LinkForm({ initial, projects, onSave, onCancel }) {
  const [form, setForm] = useState({ title: '', url: '', projectId: '', ...initial, projectId: initial?.projectId || '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.title.trim()) return setErr('title is required')
    if (!form.url.trim())   return setErr('url is required')
    setSaving(true)
    try { await onSave({ ...form, projectId: form.projectId || null }) }
    catch (e) { setErr(e.message); setSaving(false) }
  }

  return (
    <>
      {err && <div className="error-box">{err}</div>}
      <div className="form-group">
        <label>title *</label>
        <input type="text" value={form.title} onChange={set('title')} placeholder="jira board — auth service" />
      </div>
      <div className="form-group">
        <label>url *</label>
        <input type="url" value={form.url} onChange={set('url')} placeholder="https://..." />
      </div>
      <div className="form-group">
        <label>project</label>
        <select value={form.projectId} onChange={set('projectId')}>
          <option value="">— none —</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'saving...' : 'save'}</button>
      </div>
    </>
  )
}

function domain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

export default function Links() {
  const [links, setLinks]       = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [fProject, setFProject] = useState('')
  const [modal, setModal]       = useState(null)

  const load = async () => {
    const params = fProject ? { projectId: fProject } : {}
    const [l, p] = await Promise.all([api.links.list(params), api.projects.list()])
    setLinks(l); setProjects(p); setLoading(false)
  }

  useEffect(() => { load() }, [fProject])

  const handleCreate = async (d) => { await api.links.create(d); await load(); setModal(null) }
  const handleUpdate = async (d) => { await api.links.update(modal.edit.id, d); await load(); setModal(null) }
  const handleDelete = async ()  => { await api.links.delete(modal.del.id); await load(); setModal(null) }

  // group by project name
  const grouped = links.reduce((acc, l) => {
    const key = l.project?.name || 'unassigned'
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h2>links</h2>
          <p>{links.length} saved</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>+ add</button>
      </div>
      <hr className="page-divider" />

      <div className="page-body">
        <div className="filters-bar">
          <select value={fProject} onChange={(e) => setFProject(e.target.value)}>
            <option value="">all projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {fProject && <button className="btn btn-ghost btn-sm" onClick={() => setFProject('')}>clear</button>}
        </div>

        {links.length === 0 ? (
          <div className="empty-state">
            <h3>no links</h3>
            <p>save github repos, jira tickets, docs, confluence pages...</p>
            <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>add link</button>
          </div>
        ) : (
          Object.entries(grouped).map(([group, groupLinks]) => (
            <div key={group} style={{ marginBottom: 24 }}>
              <div className="section-head" style={{ marginBottom: 6 }}>
                <span className="section-label">{group}</span>
                <span className="mono muted" style={{ fontSize: 9 }}>{groupLinks.length}</span>
              </div>
              <div style={{ border: '1px solid var(--line)' }}>
                {groupLinks.map((l) => (
                  <div key={l.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 13px', borderBottom: '1px solid var(--bg3)',
                    background: 'var(--bg)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <a href={l.url} target="_blank" rel="noreferrer"
                        style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 'bold' }}>
                        {l.title}
                      </a>
                      <div className="mono muted truncate" style={{ fontSize: 10, marginTop: 1, maxWidth: 360 }}>
                        {domain(l.url)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, marginLeft: 10, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal({ edit: l })}>edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setModal({ del: l })}>del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {modal === 'create' && <Modal title="add link" onClose={() => setModal(null)}><LinkForm projects={projects} onSave={handleCreate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.edit && <Modal title="edit link" onClose={() => setModal(null)}><LinkForm initial={modal.edit} projects={projects} onSave={handleUpdate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.del && <ConfirmDialog message={`delete "${modal.del.title}"?`} onConfirm={handleDelete} onCancel={() => setModal(null)} />}
    </>
  )
}
