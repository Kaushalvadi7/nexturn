import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import MetaTags from "./components/common/MetaTags";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import QualityInspection from "./pages/QualityInspection";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import ViewAllProduct from "./components/ViewAllProduct";
import ProductDetails from "./components/ProductDetails";
import AdminAboutUs from "./pages/admin/AdminAboutUs";
import AdminCapabilities from "./pages/admin/AdminCapabilities";
import AdminInquiry from "./pages/admin/AdminInquiry";
import AdminReview from "./pages/admin/AdminReview";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminCategory from "./pages/admin/AdminCategory";
import AdminHome from "./pages/admin/AdminHome";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminRegions from "./pages/admin/AdminRegions";
import AdminManufacturingCapabilities from "./pages/admin/AdminManufacturingCapabilities";
import AdminExpertiseLeadership from "./pages/admin/AdminExpertiseLeadership";
import AdminSuccessStories from "./pages/admin/AdminSuccessStories";
import AdminInspectionEquipment from "./pages/admin/AdminInspectionEquipment";
import AdminContactInfo from "./pages/admin/AdminContactInfo";
import AdminManufacturingFacalities from "./pages/admin/AdminManufacturingFacalities";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";

import GoogleTranslate from "./components/common/GoogleTranslate";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Router>
        <GoogleTranslate />
        <ScrollToTop />
        <MetaTags />
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route element={<AdminRouteGuard />}>
            {/* Admin Routes - No MainLayout */}
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/materials" element={<AdminMaterials />} />
            <Route path="/admin/regions" element={<AdminRegions />} />
            <Route path="/admin/manufacturing-capabilities" element={<AdminManufacturingCapabilities />} />
            <Route path="/admin/expertise-leadership" element={<AdminExpertiseLeadership />} />
            <Route path="/admin/success-stories" element={<AdminSuccessStories />} />
            <Route path="/admin/inspection-equipment" element={<AdminInspectionEquipment />} />
            <Route path="/admin/aboutus" element={<AdminAboutUs />} />
            <Route path="/admin/infrastructure" element={<AdminCapabilities />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/inquiry" element={<AdminInquiry />} />
            <Route path="/admin/client-review" element={<AdminReview />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route path="/admin/contact-info" element={<AdminContactInfo />} />
            <Route path="/admin/manufacturing-facalities" element={<AdminManufacturingFacalities />} />
          </Route>

          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about-us" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="quality-inspection" element={<QualityInspection />} />
            <Route path="contact-us" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            {/* <Route path="technology" element={<Manufacturing />} /> */}

            <Route path="product-list" element={<ViewAllProduct />} />
            <Route path="product-details" element={<ProductDetails />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
