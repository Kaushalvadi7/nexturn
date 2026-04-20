import { NextFunction, Request, Response } from "express";
import db from "../models";
import logger from "../utils/logger";

const DB_PING_INTERVAL_MS = 15 * 60 * 1000;

// Keep this in-memory to throttle DB warm-up and avoid frequent CU usage.
let lastDbPingTimestamp = 0;
let isDbPingInFlight = false;

const triggerDbWarmupIfNeeded = () => {
    const now = Date.now();
    const shouldPingDb = now - lastDbPingTimestamp >= DB_PING_INTERVAL_MS;

    if (!shouldPingDb || isDbPingInFlight) {
        logger.debug("Ping endpoint: DB warm-up skipped.", {
            shouldPingDb,
            isDbPingInFlight,
        });
        return;
    }

    isDbPingInFlight = true;
    logger.info("Ping endpoint: DB warm-up triggered.");

    // Fire-and-forget query so /ping stays fast and always responsive.
    void db
        .query("SELECT 1;")
        .then(() => {
            lastDbPingTimestamp = Date.now();
            logger.debug("Ping endpoint: DB warm-up succeeded.");
        })
        .catch((error) => {
            // Intentionally swallow errors: health endpoint must stay 200 even if DB is unavailable.
            logger.warn("Ping endpoint: DB warm-up failed (ignored).", { error });
        })
        .finally(() => {
            isDbPingInFlight = false;
        });
};

const ping = (_req: Request, res: Response, _next: NextFunction) => {
    triggerDbWarmupIfNeeded();
    return res.status(200).json({ status: "OK" });
};

export default { ping };
