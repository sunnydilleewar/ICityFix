import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ToastContainer from './components/common/ToastContainer';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CreateReportPage from './pages/citizen/CreateReportPage';
import MyReportsPage from './pages/citizen/MyReportsPage';
import CitizenReportDetailPage from './pages/citizen/CitizenReportDetailPage';
import NearbyIssuesPage from './pages/citizen/NearbyIssuesPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminReportDetailPage from './pages/admin/AdminReportDetailPage';
import AdminMapPage from './pages/admin/AdminMapPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Route Protection Guards
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-civic-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-civic-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Citizen Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <CitizenDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/report"
            element={
              <RequireAuth>
                <CreateReportPage />
              </RequireAuth>
            }
          />
          <Route
            path="/my-reports"
            element={
              <RequireAuth>
                <MyReportsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <RequireAuth>
                <CitizenReportDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/nearby"
            element={
              <RequireAuth>
                <NearbyIssuesPage />
              </RequireAuth>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RequireAdmin>
                <AdminReportsPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/reports/:id"
            element={
              <RequireAdmin>
                <AdminReportDetailPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/map"
            element={
              <RequireAdmin>
                <AdminMapPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RequireAdmin>
                <AdminAnalyticsPage />
              </RequireAdmin>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
                <h2 className="text-4xl font-extrabold text-slate-800">404</h2>
                <p className="mt-2 text-sm text-slate-500">Page or municipal record not found.</p>
                <a
                  href="/"
                  className="mt-4 rounded-xl bg-civic-600 px-4 py-2 text-xs font-semibold text-white hover:bg-civic-700"
                >
                  Return Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}
