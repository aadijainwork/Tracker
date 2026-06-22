import { useEffect, useState } from 'react'
import { api } from '../api/index.js'

export default function UserSelect({ onSelect }) {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState('')

  useEffect(() => {
    api.teamMembers.list().then(setUsers)
  }, [])

  return (
    <div className="user-select-screen">
      <div className="user-select-card">
        <div className="user-select-logo">
          <div className="user-select-logo-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <h1>Engineering Hub</h1>
            <span>personal workspace</span>
          </div>
        </div>

        <h2>Who are you?</h2>
        <p>Select your profile to continue to the dashboard.</p>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Choose a team member...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <button
          disabled={!selected}
          onClick={() => onSelect(users.find((u) => u.id === selected))}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
