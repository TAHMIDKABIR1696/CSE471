import cors from 'cors'
import express from 'express'
import { apiRouter } from './routes/index.js'

export const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiRouter)
