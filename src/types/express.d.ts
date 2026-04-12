import "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            adminId: number;
            role: "admin";
        };
    }
}
