import { Router } from "express";
import productController from "../controllers/product.controller";
import { Routes } from "../interfaces/general/routes.interface";
import upload from "../middleware/upload.middleware";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ProductRoute implements Routes {
    public path = "/products";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, productController.getAllProducts);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            upload.fields([
                { name: "image", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ]),
            productController.createProduct,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            upload.fields([
                { name: "image", maxCount: 1 },
                { name: "images", maxCount: 10 },
            ]),
            productController.updateProduct,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            productController.deleteProduct,
        );
    }
}

export default ProductRoute;

