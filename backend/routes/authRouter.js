import express from "express"
import { loadController, loginController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.route("/login").post(loginController)
router.route("/load").get(authMiddleware,loadController)



export default router;