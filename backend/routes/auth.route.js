import express from "express";
import { register } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { sendVerifyOtp } from "../controllers/auth.controller.js";
import { verifyOtp } from "../controllers/auth.controller.js";
import userAuth from "../middleware/auth.middleware.js";
import { isAuthenticated } from "../controllers/auth.controller.js";
import { sendRestOtp } from "../controllers/auth.controller.js";
import { resetPassword } from "../controllers/auth.controller.js";
import { getUserData } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-otp", userAuth, verifyOtp);
router.post("/is-authenticated", userAuth, isAuthenticated);
router.post("/send-rest-otp", sendRestOtp);
router.post("/reset-password", resetPassword);
router.get("/get-user-data", userAuth, getUserData);

export default router;