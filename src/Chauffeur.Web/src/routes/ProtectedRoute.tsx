import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/state/AppStore';

export const ProtectedRoute = () => {
  const { role } = useAppStore();
  const location = useLocation();

  if (role !== 'manager') {
    return <Navigate to="/manager/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
