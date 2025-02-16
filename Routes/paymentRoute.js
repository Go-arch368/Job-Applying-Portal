import express from "express"
import authenticateUser from "../App/Middlewares/AuthenticateUser.js"
import paymentController from "../App/Controllers/stripeController.js"

const router = express.Router()

router.post("/subscribe",authenticateUser,paymentController.createCheckoutSession)
router.post("/webhooks",express.raw({type:"application/json"}),paymentController.webhooks)
export default router

