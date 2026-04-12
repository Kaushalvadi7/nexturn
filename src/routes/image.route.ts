import { Router } from "express";
import imageController from "../controllers/image.controller";
import { Routes } from "../interfaces/general/routes.interface";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ImageRoute implements Routes {
    public path = "/images";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/upload`,
            adminAuthMiddleware,
            upload.fields([
                { name: "image", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ]),
            imageController.uploadImage
        );
        this.router.delete(`${this.path}`, adminAuthMiddleware, imageController.deleteImage);
    }
}

export default ImageRoute;
