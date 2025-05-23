import catchAsyncError from '../middlewares/catchAsyncErrorMiddleware.js';
import ErrorHandler from "../utils/errorHandler.js";
import { prismaClient } from "../services/prismaService.js"
import { generateJWTToken } from '../services/authService.js';
import { createUser as createSIPUser, deleteUser as deleteSIPUser, updateUser as updateSIPUser, getUsers as getSIPUsers, isUserExists } from '../services/sipService.js';

export const createUser = catchAsyncError(async (req, res, next) => {
    const { username, password, SIP } = req.body;
    
    // Check if user already exists in database
    const existingUser = isUserExists(username);

    if (existingUser) {
        return next(new ErrorHandler('User already exists', 400));
    }

    
    await createSIPUser(username, password);

    res.status(201).json({
        success: true,
        user
    });
});

export const getUsers = catchAsyncError(async (req, res, next) => {
    const users = await getSIPUsers();
    res.status(200).json({
        success: true,
        users
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const { username } = req.params;

    const sipUsers = await getSIPUsers();
    const user = sipUsers.find(su => su.username === username);

    res.status(200).json({
        success: true,
        user
    });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
    const { username:username1 } = req.params;
    const { password, username } = req.body;

    // Check if user exists
    const existingUser = await isUserExists(username1)

    if (!existingUser) {
        return next(new ErrorHandler('User not found', 404));
    }

  
    await updateSIPUser(username, password,username1);
    

    res.status(200).json({
        success: true
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const { username } = req.params;

    // Check if user exists
    const existingUser = isUserExists(username)

    if (!existingUser) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Delete SIP user
    await deleteSIPUser(username);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
