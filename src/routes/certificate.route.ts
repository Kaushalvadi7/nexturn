import { Router } from "express";
import certificateController from "../controllers/certificate.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class CertificateRoute implements Routes {
    public path = "/certificates";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, certificateController.getAllCertificates);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            certificateController.createCertificate,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            certificateController.deleteCertificate,
        );
    }
}

export default CertificateRoute;

