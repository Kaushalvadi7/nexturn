import { Router } from "express";
import manufacturingFacalityController from "../controllers/manufacturing-facality.controller";
import { Routes } from "../interfaces/general/routes.interface";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ManufacturingFacalityRoute implements Routes {
    public path = "/manufacturing-facalities";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, manufacturingFacalityController.getAllManufacturingFacalities);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            upload.single("image"),
            manufacturingFacalityController.createManufacturingFacality,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            upload.single("image"),
            manufacturingFacalityController.updateManufacturingFacality,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            manufacturingFacalityController.deleteManufacturingFacality,
        );
    }
}

export default ManufacturingFacalityRoute;


