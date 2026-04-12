import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import HttpException from "../exceptions/HttpException";

type AdminTokenPayload = {
    adminId: number;
    role: "admin";
    iat: number;
    exp: number;
};

const getToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7).trim();
    }
    if (req.cookies?.admin_token) {
        return req.cookies.admin_token as string;
    }
    if (req.cookies?.token) {
        return req.cookies.token as string;
    }
    return null;
};

const adminAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        if (!JWT_SECRET) {
            return next(new HttpException(500, "JWT secret is not configured."));
        }

        const token = getToken(req);
        if (!token) {
            return next(new HttpException(401, "Authentication token is missing."));
        }

        const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
        if (payload.role !== "admin") {
            return next(new HttpException(403, "Forbidden."));
        }

        req.user = { adminId: payload.adminId, role: payload.role };
        return next();
    } catch (error) {
        console.log(error);
        return next(new HttpException(401, "Invalid or expired token."));
    }
};

export default adminAuthMiddleware;
