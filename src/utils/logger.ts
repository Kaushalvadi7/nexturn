import { createLogger, format, transports } from "winston";
import { LOG_LEVEL } from "../config";

const logger = createLogger({
    level: LOG_LEVEL || "info",
    format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
    transports: [new transports.Console()],
});

export default logger;
