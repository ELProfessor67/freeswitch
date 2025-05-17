import "dotenv/config"
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncErrorMiddleware.js";
import jwt from "jsonwebtoken";
import {prismaClient} from "../services/prismaService.js";


export const authMiddleware = catchAsyncError(async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) throw new ErrorHandler('Unauthorize user',401);
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
    const user = await prismaClient.user.findUnique({
        where: {
          id: decodeToken.user_id, // Replace with your token decoding logic
        }
    });


    if(!user) throw new ErrorHandler('Unauthorize user',401);

    req.user = user;
  
    next()
});