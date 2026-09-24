import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function DashboardPage() {
  const { user } = useAuth();
  return (
    <Navigate
      to={
        user?.role === "ADMIN"
          ? "/admin"
          : user?.role === "OWNER"
          ? "/owner"
          : "/user"
      }
      replace
    />
  );
}
