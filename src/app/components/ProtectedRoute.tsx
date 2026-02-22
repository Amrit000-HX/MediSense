import { Navigate } from "react-router";
import { getStoredUser } from "../api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = getStoredUser();
  
  console.log("ProtectedRoute - User:", user);
  
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("User authenticated, showing protected content");
  return <>{children}</>;
}
