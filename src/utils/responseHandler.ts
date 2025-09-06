import { Response } from "express";
import { z } from "zod";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | undefined;
  statusCode: number;
}

class ResponseHandler {
  /**
   * Send a successful response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a failure response
   */
  static failure(
    res: Response,
    message: string = "Internal Server Error",
    statusCode: number = 500,
    error?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: typeof error === "string" ? error : z.prettifyError(error),
      statusCode,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Handle async errors in a standardized way
   */
  static asyncHandler = (fn: Function) => {
    return (req: any, res: Response, next: any) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
}

export default ResponseHandler;
