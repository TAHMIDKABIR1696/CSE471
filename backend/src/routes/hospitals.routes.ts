import { Router } from 'express'
import { searchHospitalsController, getHospitalDetailController } from '../controllers/hospitals.controller.js'

export const hospitalsRouter = Router()

hospitalsRouter.get('/hospitals/search', searchHospitalsController)
hospitalsRouter.get('/hospitals/:name', getHospitalDetailController)
