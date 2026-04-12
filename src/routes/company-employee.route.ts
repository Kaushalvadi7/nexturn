import { Router } from "express";
import companyEmployeeController from "../controllers/company-employee.controller";
import { Routes } from "../interfaces/general/routes.interface";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class CompanyEmployeeRoute implements Routes {
    public path = "/company-employees";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, companyEmployeeController.getAllCompanyEmployees);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            upload.fields([{ name: "image", maxCount: 1 }]),
            companyEmployeeController.createCompanyEmployee,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            upload.fields([{ name: "image", maxCount: 1 }]),
            companyEmployeeController.updateCompanyEmployee,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            companyEmployeeController.deleteCompanyEmployee,
        );
    }
}

export default CompanyEmployeeRoute;


