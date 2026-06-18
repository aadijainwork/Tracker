import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Projects
  const p1 = await prisma.project.create({
    data: {
      name: 'Auth Service Refactor',
      description: 'Migrating legacy auth to OAuth2 with JWT tokens and refresh rotation.',
      repositoryUrl: 'https://github.com/yourorg/auth-service',
      status: 'ACTIVE',
    },
  })

  const p2 = await prisma.project.create({
    data: {
      name: 'Data Pipeline v2',
      description: 'Re-architecting ETL pipeline from batch to streaming with Kafka.',
      repositoryUrl: 'https://github.com/yourorg/data-pipeline',
      status: 'ACTIVE',
    },
  })

  const p3 = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'React Native app for customer-facing order tracking.',
      repositoryUrl: 'https://github.com/yourorg/mobile-app',
      status: 'ON_HOLD',
    },
  })

  // Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Implement refresh token rotation',
        description: 'Store hashed tokens in Redis with TTL, invalidate on use.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: p1.id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Write integration tests for /auth/token endpoint',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: p1.id,
      },
      {
        title: 'Update API documentation',
        status: 'TODO',
        priority: 'LOW',
        projectId: p1.id,
      },
      {
        title: 'Set up Kafka local dev environment',
        description: 'Docker compose with Zookeeper + Kafka + Schema Registry',
        status: 'DONE',
        priority: 'HIGH',
        projectId: p2.id,
      },
      {
        title: 'Design consumer group strategy',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        projectId: p2.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Blocked on infra team: Kafka cluster provisioning',
        description: 'Waiting on infra team to provision staging Kafka cluster.',
        status: 'BLOCKED',
        priority: 'CRITICAL',
        projectId: p2.id,
      },
      {
        title: 'Review React Native navigation library options',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: p3.id,
      },
    ],
  })

  // Meetings
  await prisma.meeting.createMany({
    data: [
      {
        title: 'Auth Service Architecture Review',
        meetingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes:
          '## Attendees\n- Team lead, Backend engineers\n\n## Decisions\n- Use RS256 for JWT signing\n- Refresh tokens stored in Redis with 7-day TTL\n- Rotate tokens on every use\n\n## Action Items\n- [ ] Set up Redis cluster in staging\n- [ ] Draft token schema spec',
      },
      {
        title: 'Weekly Engineering Sync',
        meetingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        notes:
          '## Status Updates\n- Auth refactor on track for Q3\n- Pipeline blocked on infra provisioning\n- Mobile app deprioritized until Q4\n\n## Risks\n- Kafka cluster delay could push pipeline timeline by 2 weeks',
      },
      {
        title: 'Kafka Architecture Deep Dive',
        meetingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes:
          '## Topics\n- Partition strategy\n- Exactly-once semantics\n- Consumer lag monitoring\n\n## Notes\nDecided to use Confluent Schema Registry for Avro schemas. Will use consumer groups per service.',
      },
    ],
  })

  // Links
  await prisma.link.createMany({
    data: [
      {
        title: 'Auth Service Repo',
        url: 'https://github.com/yourorg/auth-service',
        projectId: p1.id,
      },
      {
        title: 'OAuth2 RFC 6749',
        url: 'https://datatracker.ietf.org/doc/html/rfc6749',
        projectId: p1.id,
      },
      {
        title: 'Auth Service Jira Board',
        url: 'https://yourorg.atlassian.net/jira/software/projects/AUTH',
        projectId: p1.id,
      },
      {
        title: 'Data Pipeline Repo',
        url: 'https://github.com/yourorg/data-pipeline',
        projectId: p2.id,
      },
      {
        title: 'Kafka Documentation',
        url: 'https://kafka.apache.org/documentation/',
        projectId: p2.id,
      },
      {
        title: 'Confluent Schema Registry Docs',
        url: 'https://docs.confluent.io/platform/current/schema-registry/index.html',
        projectId: p2.id,
      },
    ],
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
