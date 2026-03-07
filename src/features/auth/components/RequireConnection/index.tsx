import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function RequireConnection() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.has_connected_account) {
    return <Navigate to="/onboarding" replace />;
  }

  // Passou em tudo? Libera o Dashboard!
  return <Outlet />;
}