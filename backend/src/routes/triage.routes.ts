import { Router } from 'express'
import { triageController } from '../controllers/triage.controller.js'

export const triageRouter = Router()

triageRouter.post('/triage', triageController)
