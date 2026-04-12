const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const request = async (path, options = {}) => {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  const isFormData = typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(fetchOptions.headers || {}),
    },
    ...fetchOptions,
  });

  if (response.status === 401 || response.status === 403) {
    // Avoid redirect loops if we're already on the login page
    if (!skipAuthRedirect && typeof window !== "undefined") {
      const onLoginPage = window.location?.pathname?.startsWith("/admin/login");
      if (!onLoginPage) {
        window.alert("Admin login required. Please sign in to continue.");
        window.location.href = "/admin/login";
      }
    }
    throw new Error("Admin authorization required.");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const loginAdmin = async (payload) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(payload), skipAuthRedirect: true });

export const logoutAdmin = async () =>
  request("/auth/logout", { method: "POST", skipAuthRedirect: true });

export const getAdminSession = async () =>
  request("/auth/me", { skipAuthRedirect: true });

export const getProducts = async () => request("/products");
export const getCategories = async () => request("/categories");

export const createProduct = async (payload) =>
  request("/products", { method: "POST", body: JSON.stringify(payload) });
export const updateProduct = async (id, payload) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteProduct = async (id) =>
  request(`/products/${id}`, { method: "DELETE" });

export const createCategory = async (payload) =>
  request("/categories", { method: "POST", body: JSON.stringify(payload) });
export const updateCategory = async (id, payload) =>
  request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteCategory = async (id) =>
  request(`/categories/${id}`, { method: "DELETE" });

export const createProductForm = async (formData) =>
  request("/products", { method: "POST", body: formData, headers: {} });
export const updateProductForm = async (id, formData) =>
  request(`/products/${id}`, { method: "PUT", body: formData, headers: {} });

export const createCategoryForm = async (formData) =>
  request("/categories", { method: "POST", body: formData, headers: {} });
export const updateCategoryForm = async (id, formData) =>
  request(`/categories/${id}`, { method: "PUT", body: formData, headers: {} });

export const getInquiries = async (params = {}) => {
  const search = new URLSearchParams(params).toString();
  const response = await request(`/inquiries${search ? `?${search}` : ""}`);
  return Array.isArray(response) ? response : response?.data || [];
};
export const getInquiry = async (id) => request(`/inquiries/${id}`);
export const createInquiryForm = async (formData) =>
  request("/inquiries", { method: "POST", body: formData, headers: {} });
export const updateInquiry = async (id, payload) =>
  request(`/inquiries/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteInquiry = async (id) =>
  request(`/inquiries/${id}`, { method: "DELETE" });

export const createDownloadLead = async (payload) =>
  request("/download-leads", { method: "POST", body: JSON.stringify(payload) });

export const getCertificates = async () => {
  const response = await request("/certificates");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createCertificate = async (name) =>
  request("/certificates", { method: "POST", body: JSON.stringify({ name }) });
export const deleteCertificate = async (id) =>
  request(`/certificates/${id}`, { method: "DELETE" });

export const getJourneyTimeline = async () => {
  const response = await request("/journey-timeline");
  return Array.isArray(response) ? response : response?.data || [];
};
export const saveJourneyTimeline = async (items) =>
  request("/journey-timeline", { method: "POST", body: JSON.stringify(items) });

export const getClientSuccessStories = async () => {
  const response = await request("/client-success-stories");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createClientSuccessStory = async (payload) =>
  request("/client-success-stories", { method: "POST", body: JSON.stringify(payload) });
export const deleteClientSuccessStory = async (id) =>
  request(`/client-success-stories/${id}`, { method: "DELETE" });

export const getRegions = async () => {
  const response = await request("/regions");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createRegion = async (payload) =>
  request("/regions", { method: "POST", body: JSON.stringify(payload) });
export const deleteRegion = async (id) =>
  request(`/regions/${id}`, { method: "DELETE" });

export const getPerformanceMetrices = async () => {
  const response = await request("/performance-metrices");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createPerformanceMetrices = async (payload) =>
  request("/performance-metrices", { method: "POST", body: JSON.stringify(payload) });
export const updatePerformanceMetrices = async (id, payload) =>
  request(`/performance-metrices/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deletePerformanceMetrices = async (id) =>
  request(`/performance-metrices/${id}`, { method: "DELETE" });

export const getManufacturingCapabilities = async () => {
  const response = await request("/manufacturing-capabilities");
  return Array.isArray(response) ? response : response?.data || [];
};
export const saveManufacturingCapabilities = async (items) =>
  request("/manufacturing-capabilities/bulk-save", {
    method: "POST",
    body: JSON.stringify(items),
  });
export const createManufacturingCapability = async (payload) =>
  request("/manufacturing-capabilities", { method: "POST", body: JSON.stringify(payload) });
export const updateManufacturingCapability = async (id, payload) =>
  request(`/manufacturing-capabilities/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteManufacturingCapability = async (id) =>
  request(`/manufacturing-capabilities/${id}`, { method: "DELETE" });

export const getManufacturingInfrastructures = async () => {
  const response = await request("/manufacturing-infrastructures");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createManufacturingInfrastructure = async (payload) =>
  request("/manufacturing-infrastructures", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateManufacturingInfrastructure = async (id, payload) =>
  request(`/manufacturing-infrastructures/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteManufacturingInfrastructure = async (id) =>
  request(`/manufacturing-infrastructures/${id}`, { method: "DELETE" });

export const getCompanyEmployees = async () => {
  const response = await request("/company-employees");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createCompanyEmployeeForm = async (formData) =>
  request("/company-employees", { method: "POST", body: formData, headers: {} });
export const updateCompanyEmployeeForm = async (id, formData) =>
  request(`/company-employees/${id}`, { method: "PUT", body: formData, headers: {} });
export const deleteCompanyEmployee = async (id) =>
  request(`/company-employees/${id}`, { method: "DELETE" });

export const getClientProblemSolving = async () => {
  const response = await request("/client-problem-solving");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createClientProblemSolving = async (payload) =>
  request("/client-problem-solving", { method: "POST", body: JSON.stringify(payload) });
export const updateClientProblemSolving = async (id, payload) =>
  request(`/client-problem-solving/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteClientProblemSolving = async (id) =>
  request(`/client-problem-solving/${id}`, { method: "DELETE" });

export const getInspectionEquipment = async () => {
  const response = await request("/inspection-equipment");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createInspectionEquipment = async (payload) =>
  request("/inspection-equipment", { method: "POST", body: JSON.stringify(payload) });
export const updateInspectionEquipment = async (id, payload) =>
  request(`/inspection-equipment/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteInspectionEquipment = async (id) =>
  request(`/inspection-equipment/${id}`, { method: "DELETE" });

export const getHeroSliderImages = async () => {
  const response = await request("/company-stats/hero-slider-images");
  return Array.isArray(response) ? response : response?.data || [];
};
export const addHeroSliderImagesForm = async (formData) =>
  request("/company-stats/hero-slider-images", { method: "POST", body: formData, headers: {} });
export const deleteHeroSliderImage = async (id) =>
  request(`/company-stats/hero-slider-images/${id}`, { method: "DELETE" });

export const getContactInfo = async () => request("/company-stats/contact-info");
export const saveContactInfo = async (payload) =>
  request("/company-stats/contact-info", { method: "POST", body: JSON.stringify(payload) });
export const uploadCompanyProfileForm = async (formData) =>
  request("/company-stats/company-profile", { method: "POST", body: formData, headers: {} });

export const getManufacturingFacalities = async () => {
  const response = await request("/manufacturing-facalities");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createManufacturingFacalityForm = async (formData) =>
  request("/manufacturing-facalities", { method: "POST", body: formData, headers: {} });
export const updateManufacturingFacalityForm = async (id, formData) =>
  request(`/manufacturing-facalities/${id}`, { method: "PUT", body: formData, headers: {} });
export const deleteManufacturingFacality = async (id) =>
  request(`/manufacturing-facalities/${id}`, { method: "DELETE" });

export const getMaterialSpecializations = async () => {
  const response = await request("/material-specialization");
  return Array.isArray(response) ? response : response?.data || [];
};
export const createMaterialSpecialization = async (payload) =>
  request("/material-specialization", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateMaterialSpecialization = async (id, payload) =>
  request(`/material-specialization/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const saveMaterialSpecializations = async (items) =>
  request("/material-specialization/bulk-save", {
    method: "POST",
    body: JSON.stringify(items),
  });
export const deleteMaterialSpecialization = async (id) =>
  request(`/material-specialization/${id}`, { method: "DELETE" });
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return request("/images/upload", { method: "POST", body: formData, headers: {} });
};
