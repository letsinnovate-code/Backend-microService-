import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import healthCheckRouter from "./routes/healthCheck.route.js"
import authRouter from "./routes/auth.route.js"

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:8000",
}))


//routes 

app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/auth",authRouter)


export default app;