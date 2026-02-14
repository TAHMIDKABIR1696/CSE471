import { app } from './app.js'
import { config } from './config/env.js'
import { prisma } from './config/database.js'

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use. Set PORT to a different value and retry.`)
    process.exit(1)
  }

  console.error('Server failed to start:', error)
  process.exit(1)
})

const shutdown = async () => {
  await prisma.$disconnect()
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
