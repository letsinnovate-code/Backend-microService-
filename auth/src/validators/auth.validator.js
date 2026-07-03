import {body} from "express-validator"


const userRegistrationValidator = ()=>{
    return [
        body("username")
    .notEmpty().withMessage("Username can not be empty!")
    .isString().withMessage("Username must be a string!")
    .isLength({min:3}).withMessage("Username must be at least 3 characters long!")
    .isLength({max:20}).withMessage("Username must be at most 20 characters long!")
    .trim() ,

    body("email")    
    .notEmpty().withMessage("Email can not be empty!")
    .isEmail().withMessage("Email must be a valid email!")
    .trim() ,

    body("password")
    .notEmpty().withMessage("Password can not be empty!")
    .isString().withMessage("Password must be a string!")
    .isLength({min:6}).withMessage("Password must be at least 6 characters long!")
    .isLength({max:20}).withMessage("Password must be at most 20 characters long!")
    .trim() ,

    body("phone")
    .notEmpty().withMessage("Phone can not be empty!")
    .isString().withMessage("Phone must be a string!")
    .isLength({min:10}).withMessage("Phone must be at least 10 characters long!")
    .isLength({max:10}).withMessage("Phone must be at most 10 characters long!")
    .trim() ,

    body("firstName")
    .notEmpty().withMessage("First name can not be empty!")
    .isString().withMessage("First name must be a string!")
    .isLength({min:3}).withMessage("First name must be at least 3 characters long!")
    .isLength({max:20}).withMessage("First name must be at most 20 characters long!")
    .trim() ,

    body("lastName")
    .notEmpty().withMessage("Last name can not be empty!")
    .isString().withMessage("Last name must be a string!")
    .isLength({min:3}).withMessage("Last name must be at least 3 characters long!")
    .isLength({max:20}).withMessage("Last name must be at most 20 characters long!")
    .trim()

    
    ]

    
   
}


const userLoginValidator = ()=>{
    return [
        body("email")
        .notEmpty().withMessage("Email can not be empty!")
        .isEmail().withMessage("Email must be a valid email!")
        .trim() ,

        body("password")
        .notEmpty().withMessage("Password can not be empty!")
        .isString().withMessage("Password must be a string!")
        .isLength({min:6}).withMessage("Password must be at least 6 characters long!")
        .isLength({max:20}).withMessage("Password must be at most 20 characters long!")
        .trim()
    ]
}

export {userRegistrationValidator,userLoginValidator}