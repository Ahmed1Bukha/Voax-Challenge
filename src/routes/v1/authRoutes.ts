import { Router } from "express";
import AuthController from "../../controllers/authController";
import {
  validateLogin,
  validateRegistration,
  isNotAuthenticated,
  isAuthenticated,
} from "../../middleware/authMiddleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  isNotAuthenticated,
  validateRegistration,

  authController.registerUser
);
router.post(
  "/login",

  isNotAuthenticated,
  validateLogin,
  authController.loginUser
);
router.post("/logout", isAuthenticated, authController.logout);

export default router;
