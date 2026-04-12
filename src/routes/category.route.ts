import { Router } from "express";
import categoryController from "../controllers/category.controller";
import { Routes } from "../interfaces/general/routes.interface";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class CategoryRoute implements Routes {
    public path = "/categories";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, categoryController.getAllCategories);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            upload.fields([
                { name: "image", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ]),
            categoryController.createCategory,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            upload.fields([
                { name: "image", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ]),
            categoryController.updateCategory,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            categoryController.deleteCategory,
        );
    }
}

export default CategoryRoute;

