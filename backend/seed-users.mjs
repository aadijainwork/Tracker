import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

await prisma.teamMember.createMany({
  data: [
    { name: 'Mahek' },
    { name: 'Varad' },
    { name: 'Aadi' },
    { name: 'Saheel' },
    { name: 'Shravan1' },
  ]
})

console.log('done')
await prisma.$disconnect()