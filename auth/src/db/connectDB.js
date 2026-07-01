import mongoose from "mongoose"


const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb connected Successfully!");
        
    } catch (error) {

        console.log("connection error", error);
        
        
    }
}


export default connectDB;