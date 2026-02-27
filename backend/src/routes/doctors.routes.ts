import { Router } from 'express'
import { getDoctorsController, getLocationsController, getSpecializationsController } from '../controllers/doctors.controller.js'

export const doctorsRouter = Router()

doctorsRouter.get('/doctors', getDoctorsController)
doctorsRouter.get('/locations', getLocationsController)
doctorsRouter.get('/specializations', getSpecializationsController)
