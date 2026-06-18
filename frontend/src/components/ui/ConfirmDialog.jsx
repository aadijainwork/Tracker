import Modal from './Modal.jsx'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="confirm delete" onClose={onCancel}>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink2)', marginBottom: 20 }}>{message}</p>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>delete</button>
      </div>
    </Modal>
  )
}
