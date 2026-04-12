import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { EventEmitter } from "events";
import { CORS_ALLOWED_ORIGINS, NODE_ENV, PORT } from "./config";
import { Routes } from "./interfaces/general/routes.interface";
import errorMiddleware from "./middleware/error.middleware";
import db from "./models";
import logger from "./utils/logger";

EventEmitter.defaultMaxListeners = 15;

const parseOrigins = (rawOrigins: string | undefined): string[] =>
    String(rawOrigins || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = NODE_ENV || "development";
        this.port = PORT || 3000;

        this.initializeMiddleware();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    // public listen = async () => {
    //     const sequelize = require("./path-to-your-sequelize-file");

    //     sequelize
    //         .authenticate()
    //         .then(() => console.log("✅ Connected to Neon DB"))
    //         .catch((err) => console.error("❌ DB connection error:", err));

    //     await this.connectToDB();
    //     this.app.listen(this.port, () => {
    //         logger.info(`ENV: ${this.env}`);
    //         logger.info(`App listening on port ${this.port}`);
    //     });
    // };

    public listen = async () => {
        try {
            // Connect to DB first
            await this.connectToDB();

            console.log("✅ Connected to Neon DB");

            // Start server only after DB is ready
            this.app.listen(this.port, () => {
                logger.info(`ENV: ${this.env}`);
                logger.info(`App listening on port ${this.port}`);
            });
        } catch (err) {
            console.error("❌ DB connection error:", err);
            process.exit(1);
        }
    };

    private initializeMiddleware() {
        const envOrigins = parseOrigins(CORS_ALLOWED_ORIGINS);
        const defaultDevOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];
        const allowedOrigins = this.env === "production" ? envOrigins : defaultDevOrigins;

        this.app.use(
            cors({
                origin: (origin, callback) => {
                    if (!origin) {
                        return callback(null, true);
                    }
                    if (allowedOrigins.includes(origin)) {
                        return callback(null, true);
                    }
                    return callback(new Error(`CORS blocked for origin: ${origin}`));
                },
                credentials: true,
                allowedHeaders: ["Content-Type", "Authorization"],
            }),
        );
        this.app.use(cookieParser());
        this.app.use(express.json({ limit: "10mb" }));
        this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    }

    private initializeRoutes(routes: Routes[]) {
        this.app.get("/", (_req, res) => {
            res.status(200).send("Server is running!");
        });
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private async connectToDB(): Promise<void> {
        try {
            await db.authenticate();
            logger.info("Connected to DB successfully");
        } catch (error) {
            logger.error("Failed to connect to DB", { error });
        }
    }
}

export default App;
