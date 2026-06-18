import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { meetingDate: 'desc' },
    })
    res.json(meetings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/meetings/:id
router.get('/:id', async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
    })
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' })
    res.json(meeting)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/meetings
router.post('/', async (req, res) => {
  try {
    const { title, meetingDate, notes } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    if (!meetingDate) return res.status(400).json({ error: 'meetingDate is required' })
    const meeting = await prisma.meeting.create({
      data: { title, meetingDate: new Date(meetingDate), notes },
    })
    res.status(201).json(meeting)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/meetings/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, meetingDate, notes } = req.body
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: {
        title,
        meetingDate: meetingDate ? new Date(meetingDate) : undefined,
        notes,
      },
    })
    res.json(meeting)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Meeting not found' })
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/meetings/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.meeting.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Meeting not found' })
    res.status(500).json({ error: err.message })
  }
})

export default router
