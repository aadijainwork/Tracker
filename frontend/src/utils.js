export const TASK_STATUSES    = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE']
export const TASK_PRIORITIES  = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
export const PROJECT_STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED']

export function statusBadge(status) {
  const map = {
    TODO:        ['badge-muted',  'todo'],
    IN_PROGRESS: ['badge-blue',   'in progress'],
    BLOCKED:     ['badge-red',    'blocked'],
    DONE:        ['badge-green',  'done'],
    ACTIVE:      ['badge-green',  'active'],
    ON_HOLD:     ['badge-amber',  'on hold'],
    COMPLETED:   ['badge-purple', 'completed'],
  }
  return map[status] || ['badge-muted', status]
}

export function priorityBadge(priority) {
  const map = {
    LOW:      ['badge-muted',  'low'],
    MEDIUM:   ['badge-blue',   'medium'],
    HIGH:     ['badge-amber',  'high'],
    CRITICAL: ['badge-red',    'critical'],
  }
  return map[priority] || ['badge-muted', priority]
}

export function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
