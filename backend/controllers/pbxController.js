import catchAsyncError from '../middlewares/catchAsyncErrorMiddleware.js';
import ErrorHandler from "../utils/errorHandler.js";
import { prismaClient } from "../services/prismaService.js"

// Create PBX
export const createPBXController = catchAsyncError(async (req, res, next) => {
    const { name, SIP_HOST, SIP_PORT, WSS_POST } = req.body;
    
    if(!name || !SIP_HOST || !WSS_POST){
        return next(new ErrorHandler('All fields are required.', 400));
    }

    const pbx = await prismaClient.pBX.create({
        data: {
            name,
            SIP_HOST,
            SIP_PORT,
            WSS_POST
        }
    });

    res.status(201).json({
        success: true,
        message: "PBX created successfully",
        pbx
    });
});

// Get All PBXs
export const getAllPBXsController = catchAsyncError(async (req, res, next) => {
    const pbxs = await prismaClient.pBX.findMany();

    res.status(200).json({
        success: true,
        count: pbxs.length,
        pbxs
    });
});

// Get Single PBX
export const getPBXController = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const pbx = await prismaClient.pBX.findUnique({
        where: { id }
    });

    if (!pbx) {
        return next(new ErrorHandler('PBX not found', 404));
    }

    res.status(200).json({
        success: true,
        pbx
    });
});

// Update PBX
export const updatePBXController = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, SIP_HOST, SIP_PORT, WSS_POST } = req.body;

    if(!name || !SIP_HOST){
        return next(new ErrorHandler('Name and Host are required.', 400));
    }

    const pbx = await prismaClient.pBX.findUnique({
        where: { id }
    });

    if (!pbx) {
        return next(new ErrorHandler('PBX not found', 404));
    }

    const updatedPBX = await prismaClient.pBX.update({
        where: { id },
        data: {
            name,
            SIP_HOST,
            SIP_PORT,
            WSS_POST
        }
    });

    res.status(200).json({
        success: true,
        message: "PBX updated successfully",
        pbx: updatedPBX
    });
});


