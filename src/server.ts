import App from "./app";
import ImageRoute from "./routes/image.route";
import AuthRoute from "./routes/auth.route";
import CategoryRoute from "./routes/category.route";
import ProductRoute from "./routes/product.route";
import CertificateRoute from "./routes/certificate.route";
import ClientSuccessStoryRoute from "./routes/client-success-story.route";
import InquiryRoute from "./routes/inquiry.route";
import RegionRoute from "./routes/region.route";
import ManufacturingCapabilityRoute from "./routes/manufacturing-capability.route";
import JourneyTimelineRoute from "./routes/journey-timeline.route";
import InfoTableRoute from "./routes/performance-metrices.route";
import MaterialSpecializationRoute from "./routes/material-specialization.route";
import ManufacturingInfrastructureRoute from "./routes/manufacturing-infrastructure.route";
import CompanyEmployeeRoute from "./routes/company-employee.route";
import ClientProblemSolvingRoute from "./routes/client-problem-solving.route";
import InspectionEquipmentRoute from "./routes/inspection-equipment.route";
import CompanyStatRoute from "./routes/company-stat.route";
import ManufacturingFacalityRoute from "./routes/manufacturing-facality.route";
import DownloadLeadRoute from "./routes/download-lead.route";

const appServer = new App([
    new ImageRoute(),
    new AuthRoute(),
    new CategoryRoute(),
    new ProductRoute(),
    new CertificateRoute(),
    new ClientSuccessStoryRoute(),
    new InquiryRoute(),
    new RegionRoute(),
    new ManufacturingCapabilityRoute(),
    new ManufacturingInfrastructureRoute(),
    new CompanyEmployeeRoute(),
    new ClientProblemSolvingRoute(),
    new InspectionEquipmentRoute(),
    new CompanyStatRoute(),
    new ManufacturingFacalityRoute(),
    new MaterialSpecializationRoute(),
    new JourneyTimelineRoute(),
    new InfoTableRoute(),
    new DownloadLeadRoute(),
]);
appServer.listen();

export default appServer;
