import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const [
      openTasks,
      inProgressTasks,
      blockedTasks,
      completedThisWeek,
      overdueTasks,
      teamTasks,
      recentMeetings,
      activeProjects,
    ] = await Promise.all([
      prisma.task.count({ where: { status: 'TODO' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'BLOCKED' } }),
      prisma.task.count({
        where: { status: 'DONE', updatedAt: { gte: startOfWeek } },
      }),
      prisma.task.count({
        where: {
          status: {
            not: 'DONE'
          },
          dueDate: {
            lt: new Date()
          }
        }
      }),
      prisma.task.findMany({
      where: {
        status: {
          not: 'DONE'
        }
      },

      include: {
        assignee: {
          select: {
            name: true
          }
        },
        project: {
          select: {
            name: true
          }
        }
      },

      orderBy: {
        createdAt: 'desc'
      },

      take: 20
    }),
      prisma.meeting.findMany({
        orderBy: { meetingDate: 'desc' },
        take: 5,
      }),
      prisma.project.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { tasks: true } } },
      }),
    ])

    res.json({
      taskStats: { openTasks, inProgressTasks, blockedTasks, completedThisWeek, overdueTasks },
      recentMeetings,
      activeProjects,
      teamTasks
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
