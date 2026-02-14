import { Router } from 'express'
import { getDoctorsController } from '../controllers/doctors.controller.js'

export const doctorsRouter = Router()

doctorsRouter.get('/doctors', getDoctorsController)
