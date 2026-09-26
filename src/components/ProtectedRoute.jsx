import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page container">Memuat...</div>;
  if (!user) return <Navigate to="/masuk" replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />;

  return children;
}
