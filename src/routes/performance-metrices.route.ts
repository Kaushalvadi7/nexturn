import { Router } from "express";
import infoTableController from "../controllers/performance-metrices.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class InfoTableRoute implements Routes {
    public path = "/performance-metrices";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, infoTableController.getAllInfoTable);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            infoTableController.createInfoTable,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            infoTableController.updateInfoTable,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            infoTableController.deleteInfoTable,
        );
    }
}

export default InfoTableRoute;

