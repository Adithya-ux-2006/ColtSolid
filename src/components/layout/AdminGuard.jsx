import { Navigate } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import { useAuthStore } from '../../store/authStore';

export function AdminGuard({ children }) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);

  if (!isInitialized || !user) {
    return (
      <PageWrapper className="min-h-screen bg-snow px-6 py-12">
        <div className="mx-auto max-w-xl text-center text-ink-muted">Checking admin access...</div>
      </PageWrapper>
    );
  }

  if (!user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
