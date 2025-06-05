import catchAsyncError from '../middlewares/catchAsyncErrorMiddleware.js';
import ErrorHandler from "../utils/errorHandler.js";
import { prismaClient } from "../services/prismaService.js"
import { generateJWTToken } from '../services/authService.js';

export const loginController = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password){
        return next(new ErrorHandler("All fields are required.",401))
    }




    let user = await prismaClient.user.findFirst({
        where: {
            email,
            password
        }
    });
  
   


    if (!user) {
        return next(new ErrorHandler('Invalid Credentials', 400));
    }

    user = await prismaClient.user.findFirst({
        where: {
            email,
            password
        },

        select: {
            id: true,
            password: true,
            extension_number: true,
            extension_password: true,
            role: true,
            email: true,
            pbx: true
        }
    });
   


    const jwttoken = generateJWTToken(user);

    const options = {
        httpOnly: true,    // Prevent access to the cookie from JavaScript
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Set expiration time
        secure: process.env.NODE_ENV === 'production' ? true : false,  // Only send cookies over HTTPS in production,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
    };

    res.status(200).cookie("token", jwttoken, options).json({
        success: true,
        message: "Login Successfully",
        user
    });
    
});

export const loadController = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        success: true,
        user: req.user
    });
    
});

export const logoutController = catchAsyncError(async (req, res, next) => {
    const options = {
        httpOnly: true,    // Prevent access to the cookie from JavaScript
        expires: new Date(Date.now()), // Set expiration time
        secure: process.env.NODE_ENV === 'production' ? true : false,  // Only send cookies over HTTPS in production
        sameSite: 'none'
    };

    res.status(200).cookie("token", null, options).json({
        success: true,
        message: "Logout Successfully"
    }); 
});