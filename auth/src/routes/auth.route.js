import { Router } from "express";
import { registerUser ,loginUser, getUser} from "../controllers/auth.controller.js";
import { userRegistrationValidator, userLoginValidator } from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/register",userRegistrationValidator(), registerUser)
router.post("/login",userLoginValidator(), loginUser)
router.get("/me",verifyJWT,getUser)
router.post("/logout",verifyJWT,loginUser)

export default router