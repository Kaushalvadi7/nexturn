import { Router } from "express";
import clientSuccessStoryController from "../controllers/client-success-story.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ClientSuccessStoryRoute implements Routes {
    public path = "/client-success-stories";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, clientSuccessStoryController.getAllClientSuccessStories);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            clientSuccessStoryController.createClientSuccessStory,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            clientSuccessStoryController.deleteClientSuccessStory,
        );
    }
}

export default ClientSuccessStoryRoute;

