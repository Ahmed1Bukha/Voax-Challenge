import { Request, Response, NextFunction } from "express";

// Check if user is authenticated
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    error: "Authentication required",
    message: "Please log in to access this resource",
  });
};

// Validation middleware for registration
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  // Basic email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  next();
};

// Validation middleware for login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  next();
};

// Middleware to check if user is already authenticated
export const isNotAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({
    error: "Already authenticated",
    message: "You are already logged in",
  });
};
