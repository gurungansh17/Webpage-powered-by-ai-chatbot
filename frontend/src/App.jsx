import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Chatbot from "./components/chatbot/Chatbot";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import {
  Articles,
  ArticleDetail,
  Events,
  EventDetail,
  Gallery,
  Solutions,
  SolutionDetail,
  CaseStudies,
  CaseStudyDetail,
} from "./pages/PublicPages";
import Feedback from "./pages/Feedback";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E2A3A",
              color: "#F0F4FF",
              border: "1px solid rgba(0,212,255,0.18)",
              fontSize: "0.875rem",
            },
          }}
        />

        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/solutions"
            element={
              <PublicLayout>
                <Solutions />
              </PublicLayout>
            }
          />
          <Route
            path="/solutions/:id"
            element={
              <PublicLayout>
                <SolutionDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/case-studies"
            element={
              <PublicLayout>
                <CaseStudies />
              </PublicLayout>
            }
          />
          <Route
            path="/case-studies/:id"
            element={
              <PublicLayout>
                <CaseStudyDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/articles"
            element={
              <PublicLayout>
                <Articles />
              </PublicLayout>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <PublicLayout>
                <ArticleDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/events"
            element={
              <PublicLayout>
                <Events />
              </PublicLayout>
            }
          />
          <Route
            path="/events/:id"
            element={
              <PublicLayout>
                <EventDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/gallery"
            element={
              <PublicLayout>
                <Gallery />
              </PublicLayout>
            }
          />
          <Route
            path="/feedback"
            element={
              <PublicLayout>
                <Feedback />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
