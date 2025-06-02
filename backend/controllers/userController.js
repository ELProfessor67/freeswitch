import catchAsyncError from '../middlewares/catchAsyncErrorMiddleware.js';
import ErrorHandler from "../utils/errorHandler.js";
import { prismaClient } from "../services/prismaService.js"
import { generateJWTToken } from '../services/authService.js';
import { createUser as createSIPUser, deleteUser as deleteSIPUser, updateUser as updateSIPUser, getUsers as getSIPUsers, isUserExists } from '../services/sipService.js';

export const createUser = catchAsyncError(async (req, res, next) => {
    const { username, password, pbx_id } = req.body;
    
    if (!username || !password || !pbx_id) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    // Check if PBX exists
    const pbx = await prismaClient.pBX.findUnique({
        where: { id: pbx_id }
    });

    if (!pbx) {
        return next(new ErrorHandler('PBX not found', 404));
    }

    // Check if user already exists in database
    const existingUser = await prismaClient.user.findFirst({
        where: {
            username,
            pbx_id
        }
    });
   
    if (existingUser) {
        return next(new ErrorHandler('User already exists in this PBX', 400));
    }
    
    // Create user in database
    const user = await prismaClient.user.create({
        data: {
            username,
            password,
            pbx_id
        },
        select: {
            id: true,
            password: true,
            role: true,
            username: true,
            pbx: true
        }
    });

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
    });
});

export const getUsers = catchAsyncError(async (req, res, next) => {
    const users = await prismaClient.user.findMany({
        select: {
            id: true,
            password: true,
            role: true,
            username: true,
            pbx: true
        }
    });

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;

    if (!user_id) {
        return next(new ErrorHandler('user_id is required', 400));
    }

    // Get user from database
    const user = await prismaClient.user.findFirst({
        where: { id: user_id },
        select: {
            id: true,
            password: true,
            role: true,
            username: true,
            pbx: true
        }
        
    });

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }


    res.status(200).json({
        success: true,
        user
    });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;
    const { username, password, pbx_id } = req.body;

    if (!user_id) {
        return next(new ErrorHandler('User ID is required', 400));
    }

    // Check if user exists
    const existingUser = await prismaClient.user.findUnique({
        where: { id: user_id }
    });

    if (!existingUser) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Check if PBX exists if pbx_id is provided
    if (pbx_id) {
        const pbx = await prismaClient.pBX.findUnique({
            where: { id: pbx_id }
        });

        if (!pbx) {
            return next(new ErrorHandler('PBX not found', 404));
        }
    }

    // Check if username already exists if username is being changed
    if (username && username !== existingUser.username) {
        const usernameExists = await prismaClient.user.findFirst({
            where: {
                username,
                pbx_id: pbx_id || existingUser.pbx_id,
                id: { not: user_id }
            }
        });

        if (usernameExists) {
            return next(new ErrorHandler('Username already exists', 400));
        }
    }

    // Update user
    const updatedUser = await prismaClient.user.update({
        where: { id: user_id },
        data: {
            ...(username && { username }),
            ...(password && { password }),
            ...(pbx_id && { pbx_id })
        },
        select: {
            id: true,
            password: true,
            role: true,
            username: true,
            pbx: true
        }
    });

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const { user_id } = req.params;

    if (!user_id) {
        return next(new ErrorHandler('user_id is required', 400));
    }

    // Check if user exists in database
    const existingUser = await prismaClient.user.findFirst({
        where: { id: user_id }
    });

    if (!existingUser) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Delete user from database
    await prismaClient.user.delete({
        where: { id: user_id }
    });

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
