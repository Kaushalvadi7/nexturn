import { Router } from "express";
import manufacturingCapabilityController from "../controllers/manufacturing-capability.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ManufacturingCapabilityRoute implements Routes {
    public path = "/manufacturing-capabilities";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, manufacturingCapabilityController.getAllManufacturingCapabilities);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            manufacturingCapabilityController.createManufacturingCapability,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            manufacturingCapabilityController.updateManufacturingCapability,
        );
        this.router.post(
            `${this.path}/bulk-save`,
            adminAuthMiddleware,
            manufacturingCapabilityController.saveManufacturingCapabilities,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            manufacturingCapabilityController.deleteManufacturingCapability,
        );
    }
}

export default ManufacturingCapabilityRoute;

