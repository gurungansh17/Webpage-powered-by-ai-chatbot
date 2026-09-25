import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach JWT to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Public ───────────────────────────────────────────────────────────────
export const submitEnquiry = (data) => API.post("/enquiries", data);
export const submitFeedback = (data) => API.post("/feedback", data);
export const getArticles = () => API.get("/articles");
export const getArticleById = (id) => API.get(`/articles/${id}`);
export const getEvents = () => API.get("/events");
export const getEventById = (id) => API.get(`/events/${id}`);
export const getGallery = () => API.get("/gallery");
export const getFeedback = () => API.get("/feedback");
export const getSolutions = () => API.get("/solutions");
export const getSolutionById = (id) => API.get(`/solutions/${id}`);
export const getCaseStudies = () => API.get("/casestudies");
export const getCaseStudyById = (id) => API.get(`/casestudies/${id}`);

// ─── Admin auth ───────────────────────────────────────────────────────────
export const loginAdmin = (data) => API.post("/admin/login", data);
export const getAdminProfile = () => API.get("/admin/me");

// ─── Admin — Articles ─────────────────────────────────────────────────────
export const getAdminArticles = () => API.get("/articles/admin/all");
export const createArticle = (data) => API.post("/articles", data);
export const updateArticle = (id, data) => API.put(`/articles/${id}`, data);
export const deleteArticle = (id) => API.delete(`/articles/${id}`);

// ─── Admin — Events ───────────────────────────────────────────────────────
export const getAdminEvents = () => API.get("/events/admin/all");
export const createEvent = (data) => API.post("/events", data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ─── Admin — Gallery ──────────────────────────────────────────────────────
export const getAdminGallery = () => API.get("/gallery/admin/all");
export const uploadImage = (fd) =>
  API.post("/gallery", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteImage = (id) => API.delete(`/gallery/${id}`);
export const updateImageData = (id, data) => API.put(`/gallery/${id}`, data);

// ─── Admin — Enquiries ────────────────────────────────────────────────────
export const getEnquiries = () => API.get("/enquiries");
export const deleteEnquiry = (id) => API.delete(`/enquiries/${id}`);

// ─── Admin — Feedback ─────────────────────────────────────────────────────
export const getAdminFeedback = () => API.get("/feedback/admin/all");
export const updateFeedbackStatus = (id, status) =>
  API.patch(`/feedback/${id}/status`, { status });
export const deleteFeedback = (id) => API.delete(`/feedback/${id}`);

// ─── Admin — Solutions ────────────────────────────────────────────────────
export const getAdminSolutions = () => API.get("/solutions");
export const createSolution = (data) => API.post("/solutions", data);
export const updateSolution = (id, data) => API.put(`/solutions/${id}`, data);
export const deleteSolution = (id) => API.delete(`/solutions/${id}`);

// ─── Admin — Case Studies ─────────────────────────────────────────────────
export const getAdminCaseStudies = () => API.get("/casestudies");
export const createCaseStudy = (data) => API.post("/casestudies", data);
export const updateCaseStudy = (id, data) =>
  API.put(`/casestudies/${id}`, data);
export const deleteCaseStudy = (id) => API.delete(`/casestudies/${id}`);
