
import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validator.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPassword } from "../libs/schemas/auth.schema.js";

const router = express.Router();

// path: /api/auth/login
// path: /api/auth/register
router.post("/login",validate(loginSchema), authController.login);

router.post("/register", validate(registerSchema), authController.register);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPassword), authController.resetPassword);



export default router; 