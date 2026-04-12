import { Router } from "express";
import manufacturingInfrastructureController from "../controllers/manufacturing-infrastructure.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ManufacturingInfrastructureRoute implements Routes {
    public path = "/manufacturing-infrastructures";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            this.path,
            manufacturingInfrastructureController.getAllManufacturingInfrastructures,
        );
        this.router.post(
            this.path,
            adminAuthMiddleware,
            manufacturingInfrastructureController.createManufacturingInfrastructure,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            manufacturingInfrastructureController.updateManufacturingInfrastructure,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            manufacturingInfrastructureController.deleteManufacturingInfrastructure,
        );
    }
}

export default ManufacturingInfrastructureRoute;


