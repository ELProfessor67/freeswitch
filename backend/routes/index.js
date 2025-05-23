import express from "express";
const router = express.Router()
import authRouter from "./authRouter.js"
import userRoute from "./userRoutes.js"


router.use("/auth",authRouter);
router.use("/user",userRoute);


export default router;