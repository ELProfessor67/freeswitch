import express from "express";
const router = express.Router()
import authRouter from "./authRouter.js"


router.use("/auth",authRouter);


export default router;