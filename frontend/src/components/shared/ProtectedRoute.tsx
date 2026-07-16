import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-nyu-violet animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (!user.hasProfile && location.pathname !== "/profile/setup") {
    return <Navigate replace to="/profile/setup" />;
  }

  return <>{children}</>;
}
