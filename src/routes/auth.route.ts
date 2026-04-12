import { Router } from "express";
import authController from "../controllers/auth.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class AuthRoute implements Routes {
    public path = "/auth";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, authController.login);
        this.router.post(`${this.path}/logout`, authController.logout);
        this.router.get(`${this.path}/me`, adminAuthMiddleware, authController.me);
        this.router.post(`${this.path}/admins`, authController.createAdmin);
        this.router.delete(`${this.path}/admins`, authController.deleteAdminByEmail);
    }
}

export default AuthRoute;
