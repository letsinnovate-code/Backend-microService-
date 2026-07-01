import {User} from "../models/auth.model.js"
const registerUser = async (req,res)=>{
    const {username,email,password,phone,firstName,lastName} = req.body
    console.log(req.body);
    

    const existingUser = await User.findOne({email})

    if(existingUser){
        res.status(401).json({
            success:false,
            message:"User already Exists!"
        })
    }

    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        isEmailVerified:false,
        
    })

    res.status(201).json({
        success:true,
        user,
        message:"User Created successfully!"
    })




    
    
}

export { registerUser}