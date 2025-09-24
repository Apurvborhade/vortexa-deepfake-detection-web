import { NextFunction, Request, Response } from "express";
export interface AppError extends Error {
    message: string;
    status?: number;
}   
export class AppError extends Error {
    constructor(message: string, status: number) {
        super(message);
        this.message = message;
        this.status = status;
    }
}
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error" });
};