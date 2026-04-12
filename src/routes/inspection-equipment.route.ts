import { Router } from "express";
import inspectionEquipmentController from "../controllers/inspection-equipment.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class InspectionEquipmentRoute implements Routes {
    public path = "/inspection-equipment";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, inspectionEquipmentController.getAllInspectionEquipment);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            inspectionEquipmentController.createInspectionEquipment,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            inspectionEquipmentController.updateInspectionEquipment,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            inspectionEquipmentController.deleteInspectionEquipment,
        );
    }
}

export default InspectionEquipmentRoute;


