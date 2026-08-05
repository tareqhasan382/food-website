import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const RequireAuth: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
};

export default RequireAuth;
