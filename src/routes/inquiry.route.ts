import { Router } from "express";
import inquiryController from "../controllers/inquiry.controller";
import { Routes } from "../interfaces/general/routes.interface";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class InquiryRoute implements Routes {
    public path = "/inquiries";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, adminAuthMiddleware, inquiryController.getAllInquiries);
        this.router.get(`${this.path}/:id`, adminAuthMiddleware, inquiryController.getInquiryById);
        this.router.post(this.path, upload.array("files", 10), inquiryController.createInquiry);
        this.router.patch(`${this.path}/:id`, adminAuthMiddleware, inquiryController.updateInquiry);
        this.router.delete(`${this.path}/:id`, adminAuthMiddleware, inquiryController.deleteInquiry);
    }
}

export default InquiryRoute;
