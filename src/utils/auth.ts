// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import config from "../config/config";
// export interface JWTPayload {
//   userId: string;
//   email: string;
// }
// const JWT_SECRET = config.JWT.JWT_SECRET;
// const JWT_EXPIRES_IN = config.JWT.JWT_EXPIRES_IN;

// export class AuthUtils {
//   // Generate JWT token
//   static generateToken(payload: JWTPayload): string {
//     return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
//   }

//   // Verify JWT token
//   static verifyToken(token: string): JWTPayload {
//     return jwt.verify(token, JWT_SECRET) as JWTPayload;
//   }

//   // Hash password
//   static async hashPassword(password: string): Promise<string> {
//     return bcrypt.hash(password, 12);
//   }

//   // Compare password
//   static async comparePassword(
//     password: string,
//     hashedPassword: string
//   ): Promise<boolean> {
//     return bcrypt.compare(password, hashedPassword);
//   }
// }
