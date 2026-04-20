import { Router } from "express";
import { Routes } from "../interfaces/general/routes.interface";
import pingController from "../controllers/ping.controller";

class PingRoute implements Routes {
    public path = "/ping";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, pingController.ping);
    }
}

export default PingRoute;
