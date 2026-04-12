import { Router } from "express";
import journeyTimelineController from "../controllers/journey-timeline.controller";
import { Routes } from "../interfaces/general/routes.interface";
import adminAuthMiddleware from "../middleware/admin-auth.middleware";

class JourneyTimelineRoute implements Routes {
    public path = "/journey-timeline";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, journeyTimelineController.getJourneyTimeline);
        this.router.post(
            this.path,
            adminAuthMiddleware,
            journeyTimelineController.createJourneyTimeline,
        );
    }
}

export default JourneyTimelineRoute;

