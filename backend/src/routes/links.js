import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/links
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query
    const where = projectId ? { projectId } : {}
    const links = await prisma.link.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { id: true, name: true } } },
    })
    res.json(links)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/links/:id
router.get('/:id', async (req, res) => {
  try {
    const link = await prisma.link.findUnique({
      where: { id: req.params.id },
      include: { project: true },
    })
    if (!link) return res.status(404).json({ error: 'Link not found' })
    res.json(link)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/links
router.post('/', async (req, res) => {
  try {
    const { title, url, projectId } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    if (!url) return res.status(400).json({ error: 'url is required' })
    const link = await prisma.link.create({
      data: { title, url, projectId: projectId || null },
      include: { project: { select: { id: true, name: true } } },
    })
    res.status(201).json(link)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/links/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, url, projectId } = req.body
    const link = await prisma.link.update({
      where: { id: req.params.id },
      data: { title, url, projectId: projectId || null },
      include: { project: { select: { id: true, name: true } } },
    })
    res.json(link)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Link not found' })
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/links/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.link.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Link not found' })
    res.status(500).json({ error: err.message })
  }
})

export default router
