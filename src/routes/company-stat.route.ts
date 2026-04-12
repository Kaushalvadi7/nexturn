import { Router } from "express";
import { Routes } from "../interfaces/general/routes.interface";
import companyStatController from "../controllers/company-stat.controller";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class CompanyStatRoute implements Routes {
    public path = "/company-stats";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/hero-slider-images`,
            companyStatController.getHeroSliderImages,
        );
        this.router.post(
            `${this.path}/hero-slider-images`,
            adminAuthMiddleware,
            upload.array("images", 7),
            companyStatController.addHeroSliderImages,
        );
        this.router.delete(
            `${this.path}/hero-slider-images/:id`,
            adminAuthMiddleware,
            companyStatController.deleteHeroSliderImage,
        );

        this.router.get(
            `${this.path}/contact-info`,
            companyStatController.getContactInfo,
        );
        this.router.post(
            `${this.path}/contact-info`,
            adminAuthMiddleware,
            companyStatController.replaceContactInfo,
        );
        this.router.post(
            `${this.path}/company-profile`,
            adminAuthMiddleware,
            upload.single("file"),
            companyStatController.uploadCompanyProfile,
        );
    }
}

export default CompanyStatRoute;

