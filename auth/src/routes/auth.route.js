import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { userRegistrationValidator } from "../validators/auth.validator.js";


const router = Router()

router.post("/register",userRegistrationValidator(), registerUser)

export default router