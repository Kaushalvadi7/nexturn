import { Router } from "express";
import { Routes } from "../interfaces/general/routes.interface";
import downloadLeadController from "../controllers/download-lead.controller";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class DownloadLeadRoute implements Routes {
    public path = "/download-leads";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path, downloadLeadController.createDownloadLead);
        this.router.get(`${this.path}/file`, downloadLeadController.downloadAsset);
        this.router.get(
            "/admin/company-profile-downloads",
            adminAuthMiddleware,
            downloadLeadController.getCompanyProfileDownloads,
        );
    }
}

export default DownloadLeadRoute;
