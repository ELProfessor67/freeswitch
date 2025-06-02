import express from "express";
const router = express.Router()
import authRouter from "./authRouter.js"
import userRoute from "./userRoutes.js"
import pbxRoutes from './pbxRoutes.js'


router.use("/auth",authRouter);
router.use("/user",userRoute);
router.use('/pbx', pbxRoutes);


export default router;          