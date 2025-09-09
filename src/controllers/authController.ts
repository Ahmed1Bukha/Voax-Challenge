import { Request, Response } from "express";
import AuthService from "../services/auth";
import ResponseHandler from "../utils/responseHandler";
import userSchema from "../models/user";
import { UserModel } from "../models/user";
import passport from "passport";
export default class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  registerUser = async (req: Request, res: Response) => {
    try {
      const validatedRequest = userSchema.safeParse(req.body);
      if (!validatedRequest.success) {
        return ResponseHandler.failure(
          res,
          "Invalid request",
          400,
          validatedRequest.error
        );
      }
      const { email, password } = validatedRequest.data;
      const user: UserModel = await this.authService.registerUser(
        email,
        password
      );
      req.login(user, (err) => {
        if (err) {
          return ResponseHandler.failure(
            res,
            "Internal server error",
            500,
            err
          );
        }
        return ResponseHandler.success(
          res,
          user,
          "User registered successfully"
        );
      });
    } catch (error) {
      console.error(error);
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const validatedRequest = userSchema.safeParse(req.body);
      if (!validatedRequest.success) {
        return ResponseHandler.failure(
          res,
          "Invalid request",
          400,
          validatedRequest.error
        );
      }
      return passport.authenticate(
        "local",
        (err: any, user: any, info: any) => {
          if (err) {
            return ResponseHandler.failure(
              res,
              "Internal server error",
              500,
              err
            );
          }
          if (!user) {
            return ResponseHandler.failure(
              res,
              "Invalid credentials",
              401,
              info
            );
          }
          req.login(user, (loginErr: any) => {
            if (loginErr) {
              return ResponseHandler.failure(
                res,
                "Internal server error",
                500,
                loginErr
              );
            }
            return ResponseHandler.success(
              res,
              user,
              "User logged in successfully"
            );
          });
        }
      )(req, res);
    } catch (error) {
      console.error(error);
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  };

  logout = (req: Request, res: Response) => {
    try {
      req.logout((err) => {
        if (err) {
          console.error("Logout error:", err);
          res.status(500).json({ error: "Logout failed" });
          return;
        }

        req.session.destroy((err) => {
          if (err) {
            console.error("Session destroy error:", err);
            res.status(500).json({ error: "Logout failed" });
            return;
          }

          res.clearCookie("connect.sid");
          res.json({
            success: true,
            message: "Logout successful",
          });
        });
      });
    } catch (error) {
      console.error(error);
      return ResponseHandler.failure(res, "Internal server error", 500, error);
    }
  };
}
