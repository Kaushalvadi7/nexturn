import { Router } from "express";
import materialSpecializationController from "../controllers/material-specialization.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class MaterialSpecializationRoute implements Routes {
    public path = "/material-specialization";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, materialSpecializationController.getAllMaterialSpecializations);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            materialSpecializationController.createMaterialSpecialization,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            materialSpecializationController.updateMaterialSpecialization,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            materialSpecializationController.deleteMaterialSpecialization,
        );
    }
}

export default MaterialSpecializationRoute;

