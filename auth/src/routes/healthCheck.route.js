import { Router } from "express";
import healthCheckController from "../controllers/healthCheck.controller.js"

const router = Router()

router.post("/",healthCheckController)

export default router