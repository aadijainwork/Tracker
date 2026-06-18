import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    res.json(members)
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const member = await prisma.teamMember.create({
      data: {
        name: req.body.name
      }
    })

    res.status(201).json(member)
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

export default router