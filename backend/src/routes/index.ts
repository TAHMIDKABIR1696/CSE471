import { Router } from 'express'
import { doctorsRouter } from './doctors.routes.js'
import { triageRouter } from './triage.routes.js'

export const apiRouter = Router()

apiRouter.use(triageRouter)
apiRouter.use(doctorsRouter)
