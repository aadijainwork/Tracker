import { useEffect, useState } from 'react'
import { api } from '../api/index.js'
import { statusBadge, priorityBadge, fmtDate, TASK_STATUSES, TASK_PRIORITIES } from '../utils.js'
import Modal from '../components/ui/Modal.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'

const COLS = [
  { key: 'TODO',        label: 'to do' },
  { key: 'IN_PROGRESS', label: 'in progress' },
  { key: 'BLOCKED',     label: 'blocked' },
  { key: 'DONE',        label: 'done' },
]

function TaskForm({ initial, projects, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', projectId: '',
    ...initial,
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : '',
    projectId: initial?.projectId || '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.title.trim()) return setErr('title is required')
    setSaving(true)
    try { await onSave({ ...form, dueDate: form.dueDate || null, projectId: form.projectId || null }) }
    catch (e) { setErr(e.message); setSaving(false) }
  }

  return (
    <>
      {err && <div className="error-box">{err}</div>}
      <div className="form-group">
        <label>title *</label>
        <input type="text" value={form.title} onChange={set('title')} placeholder="implement token rotation" />
      </div>
      <div className="form-group">
        <label>description</label>
        <textarea value={form.description || ''} onChange={set('description')} placeholder="context, notes, links..." />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>status</label>
          <select value={form.status} onChange={set('status')}>
            {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>priority</label>
          <select value={form.priority} onChange={set('priority')}>
            {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>due date</label>
          <input type="date" value={form.dueDate} onChange={set('dueDate')} />
        </div>
        <div className="form-group">
          <label>project</label>
          <select value={form.projectId} onChange={set('projectId')}>
            <option value="">— none —</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'saving...' : 'save'}</button>
      </div>
    </>
  )
}

function KanbanCard({ task, onEdit, onDelete }) {
  const [pCls, pLabel] = priorityBadge(task.priority)
  return (
    <div className="kanban-card">
      <div className="kanban-card-title">{task.title}</div>
      <div className="kanban-card-meta">
        <span className={`badge ${pCls}`}>{pLabel.toLowerCase()}</span>
        {task.project && <span className="kanban-card-project">{task.project.name}</span>}
      </div>
      {task.dueDate && (
        <div className="mono muted" style={{ fontSize: 9, marginTop: 5 }}>
          due {fmtDate(task.dueDate)}
        </div>
      )}
      <div className="kanban-card-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(task)}>del</button>
      </div>
    </div>
  )
}

export default function Tasks() {
  const [tasks, setTasks]       = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [fStatus, setFStatus]   = useState('')
  const [fProject, setFProject] = useState('')
  const [modal, setModal]       = useState(null)

  const load = async () => {
    const params = {}
    if (fStatus)  params.status    = fStatus
    if (fProject) params.projectId = fProject
    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );
    const [t, p] = await Promise.all([
      api.tasks.list({
        ...params,
        assigneeId: currentUser.id
      }),
      api.projects.list()
    ])
    setTasks(t); setProjects(p); setLoading(false)
  }

  useEffect(() => { load() }, [fStatus, fProject])

  const handleCreate = async (d) => {
    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    await api.tasks.create({
      ...d,
      assigneeId: currentUser.id
    });

    await load();

    setModal(null);
}
  const handleUpdate = async (d) => { await api.tasks.update(modal.edit.id, d); await load(); setModal(null) }
  const handleDelete = async ()  => { await api.tasks.delete(modal.del.id); await load(); setModal(null) }

  const grouped = COLS.reduce((a, c) => ({ ...a, [c.key]: tasks.filter((t) => t.status === c.key) }), {})

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h2>tasks</h2>
          <p>{tasks.length} showing</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>+ new</button>
      </div>
      <hr className="page-divider" />

      <div className="page-body">
        <div className="filters-bar">
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            <option value="">all statuses</option>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_',' ').toLowerCase()}</option>)}
          </select>
          <select value={fProject} onChange={(e) => setFProject(e.target.value)}>
            <option value="">all projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {(fStatus || fProject) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFStatus(''); setFProject('') }}>
              clear
            </button>
          )}
        </div>

        <div className="kanban-board">
          {COLS.map((col) => (
            <div key={col.key} className="kanban-col">
              <div className="kanban-col-header">
                <span>{col.label}</span>
                <span className="kcount">{grouped[col.key].length}</span>
              </div>
              <div className="kanban-cards">
                {grouped[col.key].length === 0
                  ? <div className="mono muted" style={{ fontSize: 10, padding: '12px 4px', textAlign: 'center' }}>empty</div>
                  : grouped[col.key].map((t) => (
                      <KanbanCard key={t.id} task={t}
                        onEdit={(t) => setModal({ edit: t })}
                        onDelete={(t) => setModal({ del: t })}
                      />
                    ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal === 'create' && <Modal title="new task" onClose={() => setModal(null)}><TaskForm projects={projects} onSave={handleCreate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.edit && <Modal title="edit task" onClose={() => setModal(null)}><TaskForm initial={modal.edit} projects={projects} onSave={handleUpdate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.del && <ConfirmDialog message={`delete "${modal.del.title}"?`} onConfirm={handleDelete} onCancel={() => setModal(null)} />}
    </>
  )
}
