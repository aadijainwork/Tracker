import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { ownerId } = req.query
    const projects = await prisma.project.findMany({
      where: ownerId
        ? { ownerId }
        : undefined,

      orderBy: {
        createdAt: 'desc'
      },

      include: {
        _count: {
          select: {
            tasks: true,
            links: true
          }
        },

        owner: {
          select: {
            name: true
          }
        },

        members: {
          include: {
            member: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { tasks: true, links: true },
    })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/projects
router.post('/', async (req, res) => {
  try {

    console.log("BODY:", req.body)

    const {
      name,
      description,
      repositoryUrl,
      status,
      ownerId
    } = req.body

    console.log("OWNER ID:", ownerId)

    const project = await prisma.project.create({
      data: {
        name,
        description,
        repositoryUrl,
        status: status || 'ACTIVE',
        ownerId
      }
    })

    console.log("CREATED:", project)

    res.status(201).json(project)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/projects/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description, repositoryUrl, status } = req.body
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description, repositoryUrl, status },
    })
    res.json(project)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Project not found' })
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Project not found' })
    res.status(500).json({ error: err.message })
  }
})

export default router
