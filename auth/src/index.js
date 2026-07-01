import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";


dotenv.config({
    path:"./.env"
})

const port = process.env.PORT ?? 8000

connectDB()
.then(()=>{
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
    
})
})
.catch((err)=>{
    console.log("mongoDb connection error!");
    
})

