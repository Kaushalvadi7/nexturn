import { Router } from "express";
import regionController from "../controllers/region.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class RegionRoute implements Routes {
    public path = "/regions";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, regionController.getAllRegions);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            regionController.createRegion,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            regionController.deleteRegion,
        );
    }
}

export default RegionRoute;

