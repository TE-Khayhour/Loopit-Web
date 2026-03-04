import { Navigate } from 'react-router-dom';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = sessionStorage.getItem('loopit-admin') === 'true';
  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

export default RequireAuth;
