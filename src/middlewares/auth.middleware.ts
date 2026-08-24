import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { AppError } from "../shared/errors/AppError.js";

interface JwtPayload{
    userId: string
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError(401, "Token requerido");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new AppError(401, "Token inválido");
    }

    try {
        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        ) as JwtPayload;

        req.user = {
            id: decoded.userId
        };

        next();

    } catch {
        throw new AppError(401, "Token inválido");
    }
}