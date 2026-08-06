import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { isAdminRole } from "../../types/auth";

const GuestOnly: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  if (user) {
    // Send admins to the dashboard, regular users back where they came from.
    const fallback = isAdminRole(user.role) ? "/dashboard" : "/";
    return <Navigate to={from ?? fallback} replace />;
  }

  return <Outlet />;
};

export default GuestOnly;
