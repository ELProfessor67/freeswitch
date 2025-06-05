import catchAsyncError from '../middlewares/catchAsyncErrorMiddleware.js';
import ErrorHandler from "../utils/errorHandler.js";
import { prismaClient } from "../services/prismaService.js"
import { generateJWTToken } from '../services/authService.js';
import { createUser as createSIPUser, deleteUser as deleteSIPUser, updateUser as updateSIPUser, getUsers as getSIPUsers, isUserExists } from '../services/sipService.js';
import bcrypt from 'bcrypt';

export const createUser = catchAsyncError(async (req, res, next) => {
    const { email, password,extension_number,extension_password, pbx_id,role } = req.body;
    
    if (!email || !password || !pbx_id) {
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
            email
        }
    });
   
    if (existingUser) {
        return next(new ErrorHandler('User already exists with this email', 400));
    }
    
    // Create user in database
    const user = await prismaClient.user.create({
        data: {
            email,
            password,
            extension_number,
            extension_password,
            role: role || "USER",
            pbx_id
        },
        select: {
            id: true,
            password: true,
            role: true,
            email: true,
            extension_number: true,
            extension_password: true,
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
            email: true,
            extension_number: true,
            extension_password: true,
            role: true,
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
            email,
            extension_number,
            extension_password,
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
    const { email, password, extension_number, extension_password, pbx_id, role } = req.body;

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

    // Check if email already exists if email is being changed
    if (email && email !== existingUser.email) {
        const emailExists = await prismaClient.user.findFirst({
            where: {
                email,
            }
        });

        if (emailExists) {
            return next(new ErrorHandler('Email already exists', 400));
        }
    }



    // Update user
    const updatedUser = await prismaClient.user.update({
        where: { id: user_id },
        data: {
            ...(email && { email }),
            ...(password && { password }),
            ...(extension_number && { extension_number }),
            ...(extension_password && { extension_password }),
            ...(pbx_id && { pbx_id }),
            ...(role && { role })
        },
        select: {
            id: true,
            email: true,
            extension_number: true,
            extension_password: true,
            role: true,
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
