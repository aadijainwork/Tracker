const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  dashboard: {
    get: () => request('/dashboard'),
  },
  teamMembers: {
    list: () => request('/team-members'),
    create: (data) => request('/team-members', { method: 'POST', body: data }),
  },
  projects: {
    list: (params) => {
      const qs =
        new URLSearchParams(
          params || {}
        ).toString()

      return request(
        `/projects${qs ? `?${qs}` : ''}`
      )
    },
    get:    (id)     => request(`/projects/${id}`),
    create: (data)   => request('/projects', { method: 'POST', body: data }),
    update: (id, d)  => request(`/projects/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => request(`/projects/${id}`, { method: 'DELETE' }),
  },
  tasks: {
    list:   (params) => {
      const qs = new URLSearchParams(params || {}).toString()
      return request(`/tasks${qs ? `?${qs}` : ''}`)
    },
    get:    (id)     => request(`/tasks/${id}`),
    create: (data)   => request('/tasks', { method: 'POST', body: data }),
    update: (id, d)  => request(`/tasks/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => request(`/tasks/${id}`, { method: 'DELETE' }),
  },
  meetings: {
    list:   ()       => request('/meetings'),
    get:    (id)     => request(`/meetings/${id}`),
    create: (data)   => request('/meetings', { method: 'POST', body: data }),
    update: (id, d)  => request(`/meetings/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => request(`/meetings/${id}`, { method: 'DELETE' }),
  },
  links: {
    list:   (params) => {
      const qs = new URLSearchParams(params || {}).toString()
      return request(`/links${qs ? `?${qs}` : ''}`)
    },
    create: (data)   => request('/links', { method: 'POST', body: data }),
    update: (id, d)  => request(`/links/${id}`, { method: 'PUT', body: d }),
    delete: (id)     => request(`/links/${id}`, { method: 'DELETE' }),
  },
}
