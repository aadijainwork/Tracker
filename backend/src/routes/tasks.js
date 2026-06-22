import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { status, projectId, assigneeId } = req.query
    const where = {}
    if (status) where.status = status
    if (projectId) where.projectId = projectId
    if (assigneeId) where.assigneeId = assigneeId

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: { project: { select: { id: true, name: true } } },
    })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId || null,
        assigneeId: assigneeId || null,
      },
      include: { project: { select: { id: true, name: true } } },
    })
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId || null,
        assigneeId: assigneeId || null,
      },
      include: { project: { select: { id: true, name: true } } },
    })
    res.json(task)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Task not found' })
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Task not found' })
    res.status(500).json({ error: err.message })
  }
})

export default router
