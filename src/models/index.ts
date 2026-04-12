import { Sequelize } from "sequelize-typescript";
import { DATABASE_URL } from "../config";
import logger from "../utils/logger";
import Admin from "./Admin";
import Category from "./Category";
import ClientSuccessStory from "./ClientSuccessStory";
import ClientProblemSolving from "./ClientProblemSolving";
import CompanyEmployee from "./CompanyEmployee";
import CompanyStat from "./CompanyStat";
import Image from "./Image";
import Inquiry from "./Inquiry";
import InspectionEquipment from "./InspectionEquipment";
import ManufacturingCapability from "./ManufacturingCapability";
import ManufacturingFacality from "./ManufacturingFacality";
import ManufacturingInfrastructure from "./ManufacturingInfrastructure";
import MaterialGrade from "./MaterialGrade";
import MaterialSpecialization from "./MaterialSpecialization";
import Product from "./Product";
import Certificate from "./Certificate";
import JourneyTimeline from "./JourneyTimeline";
import InfoTable from "./PerformanceMetrices";
import ExportRegion from "./ExportRegion";

const db = new Sequelize(DATABASE_URL || "", {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: (sql, timing) => {
        logger.debug(`[${timing}ms] ${sql}`);
    },
    benchmark: true,
});

db.addModels([
    Admin,
    Category,
    ClientSuccessStory,
    ClientProblemSolving,
    CompanyEmployee,
    CompanyStat,
    Image,
    Inquiry,
    InspectionEquipment,
    ManufacturingCapability,
    ManufacturingFacality,
    ManufacturingInfrastructure,
    MaterialGrade,
    MaterialSpecialization,
    Product,
    ExportRegion,
    Certificate,
    JourneyTimeline,
    InfoTable,
]);

export default db;
