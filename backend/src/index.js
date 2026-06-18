import express from 'express'
import cors from 'cors'
import dashboardRouter from './routes/dashboard.js'
import projectsRouter from './routes/projects.js'
import tasksRouter from './routes/tasks.js'
import meetingsRouter from './routes/meetings.js'
import linksRouter from './routes/links.js'
import teamMembersRouter from './routes/teamMembers.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/dashboard', dashboardRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/meetings', meetingsRouter)
app.use('/api/links', linksRouter)
app.use('/api/team-members', teamMembersRouter)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.use((err, req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Engineering Hub API running on http://localhost:${PORT}`)
})
