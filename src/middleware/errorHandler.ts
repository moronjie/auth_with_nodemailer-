import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
  }

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      statusCode,
      message
    });
  };

export const customError = (message:string, statusCode:number) => {
    const error = new Error() as Error & { statusCode: number };
    error.statusCode = statusCode
    error.message = message
    return error 
  }