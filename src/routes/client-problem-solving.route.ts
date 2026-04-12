import { Router } from "express";
import clientProblemSolvingController from "../controllers/client-problem-solving.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class ClientProblemSolvingRoute implements Routes {
    public path = "/client-problem-solving";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, clientProblemSolvingController.getAllClientProblemSolving);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            clientProblemSolvingController.createClientProblemSolving,
        );
        this.router.put(
            `${this.path}/:id`,
            adminAuthMiddleware,
            clientProblemSolvingController.updateClientProblemSolving,
        );
        this.router.delete(
            `${this.path}/:id`,
            adminAuthMiddleware,
            clientProblemSolvingController.deleteClientProblemSolving,
        );
    }
}

export default ClientProblemSolvingRoute;


