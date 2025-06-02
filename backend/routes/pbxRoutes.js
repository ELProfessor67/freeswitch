import express from 'express';
import {
    createPBXController,
    getAllPBXsController,
    getPBXController,
    updatePBXController
} from '../controllers/pbxController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);
// Create PBX
router.post('/', createPBXController);
// Get all PBXs
router.get('/', getAllPBXsController);
// Get single PBX
router.get('/:id', getPBXController);
// Update PBX
router.put('/:id', updatePBXController);

export default router;