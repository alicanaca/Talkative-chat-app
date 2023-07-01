import express from 'express'
import protect from "../middleware/authMiddleware.js"
import { sendNotif } from '../controllers/notifController.js'

const router = express.Router()

router.route('/').post(protect, sendNotif)

export default router