import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { authUser } = useSelector((state) => state.auth);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role !== "admin") {
    return <Navigate to="/dashboard/community" replace />;
  }

  return children;
};

export default AdminRoute;