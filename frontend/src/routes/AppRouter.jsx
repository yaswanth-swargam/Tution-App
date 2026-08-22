import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import DashboardLayout from "../layouts/DashboardLayout";

import CommunityPage from "../pages/CommunityPage";
import MaterialsPage from "../pages/MaterialsPage";
import AIPage from "../pages/AIPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";

const PublicRoute = ({ children }) => {
  const { authUser } = useSelector((state) => state.auth);

  if (authUser) {
    return <Navigate to="/dashboard/community" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Navigate to="community" replace />}
        />

        <Route path="community" element={<CommunityPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="ai" element={<AIPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard/community" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;