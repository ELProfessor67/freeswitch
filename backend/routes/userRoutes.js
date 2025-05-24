import express from "express"
import { createUser,deleteUser,getUser, getUsers,updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();


router.route("/create").post(authMiddleware,createUser)
router.route("/update/:username").put(authMiddleware,updateUser)
router.route("/delete/:username").delete(authMiddleware,deleteUser)
router.route("/get").get(authMiddleware,getUsers)
router.route("/get/:username").get(authMiddleware,getUser)


export default router;