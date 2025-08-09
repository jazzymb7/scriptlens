import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const ProtectedRoutes = () => {
  const { user, loader } = useAuth();
  if (loader) {
    return <Loading />;
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
