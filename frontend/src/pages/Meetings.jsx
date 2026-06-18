import { useEffect, useState } from 'react'
import { api } from '../api/index.js'
import { fmtDate } from '../utils.js'
import Modal from '../components/ui/Modal.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'

function MeetingForm({ initial, onSave, onCancel }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    title: '', meetingDate: today, notes: '', ...initial,
    meetingDate: initial?.meetingDate ? new Date(initial.meetingDate).toISOString().slice(0, 10) : today,
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.title.trim()) return setErr('title is required')
    setSaving(true)
    try { await onSave(form) }
    catch (e) { setErr(e.message); setSaving(false) }
  }

  return (
    <>
      {err && <div className="error-box">{err}</div>}
      <div className="form-group">
        <label>title *</label>
        <input type="text" value={form.title} onChange={set('title')} placeholder="auth service design review" />
      </div>
      <div className="form-group">
        <label>date *</label>
        <input type="date" value={form.meetingDate} onChange={set('meetingDate')} />
      </div>
      <div className="form-group">
        <label>notes</label>
        <textarea
          value={form.notes || ''}
          onChange={set('notes')}
          style={{ minHeight: 180, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7 }}
          placeholder={"attendees:\n- \n\ndecisions:\n- \n\naction items:\n- [ ] "}
        />
      </div>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'saving...' : 'save'}</button>
      </div>
    </>
  )
}

function MeetingRow({ meeting, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px', cursor: 'pointer', background: 'var(--bg)',
          transition: 'background .08s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
        onClick={() => setOpen((v) => !v)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mono muted" style={{ fontSize: 10 }}>{open ? '▾' : '▸'}</span>
          <div>
            <div className="mono" style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--ink)' }}>{meeting.title}</div>
            <div className="mono muted" style={{ fontSize: 10, marginTop: 1 }}>{fmtDate(meeting.meetingDate)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5 }} onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(meeting)}>edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(meeting)}>del</button>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 14px 14px 38px' }}>
          {meeting.notes ? (
            <pre style={{
              fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink2)',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.75,
              background: 'var(--bg2)', border: '1px solid var(--line)',
              padding: '10px 12px',
            }}>{meeting.notes}</pre>
          ) : (
            <p className="mono muted" style={{ fontSize: 11 }}>no notes.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Meetings() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)

  const load = () => api.meetings.list().then(setMeetings).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleCreate = async (d) => { await api.meetings.create(d); await load(); setModal(null) }
  const handleUpdate = async (d) => { await api.meetings.update(modal.edit.id, d); await load(); setModal(null) }
  const handleDelete = async ()  => { await api.meetings.delete(modal.del.id); await load(); setModal(null) }

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h2>meetings</h2>
          <p>{meetings.length} notes</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>+ new</button>
      </div>
      <hr className="page-divider" />

      <div className="page-body">
        {meetings.length === 0 ? (
          <div className="empty-state">
            <h3>no meeting notes</h3>
            <p>record decisions and action items from your meetings.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>add meeting</button>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--line)' }}>
            {meetings.map((m) => (
              <MeetingRow key={m.id} meeting={m}
                onEdit={(m) => setModal({ edit: m })}
                onDelete={(m) => setModal({ del: m })}
              />
            ))}
          </div>
        )}
      </div>

      {modal === 'create' && <Modal title="new meeting" onClose={() => setModal(null)}><MeetingForm onSave={handleCreate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.edit && <Modal title="edit meeting" onClose={() => setModal(null)}><MeetingForm initial={modal.edit} onSave={handleUpdate} onCancel={() => setModal(null)} /></Modal>}
      {modal?.del && <ConfirmDialog message={`delete "${modal.del.title}"?`} onConfirm={handleDelete} onCancel={() => setModal(null)} />}
    </>
  )
}
