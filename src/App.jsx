import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Navbar, BottomNav, AdminGuard } from './components/layout';
import { useAuthStore } from './store/authStore';
import { useFavoritesStore } from './store/favoritesStore';
import { useAppointmentStore } from './store/appointmentStore';
import { useCatalogStore } from './store/catalogStore';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';

// AiChatPanel is lazy-loaded to keep the layout chunk small.
// It pulls in symptomEngine + symptomSearch (~heavy) and is only
// needed when the user opens the chat panel.
const AiChatPanel = lazy(() => import('./components/ai/AiChatPanel').then(m => ({ default: m.AiChatPanel })));

// Pages — lazy-loaded for code splitting
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const SymptomSearch = lazy(() => import('./pages/SymptomSearch').then(m => ({ default: m.SymptomSearch })));
const Results = lazy(() => import('./pages/Results').then(m => ({ default: m.Results })));
const RemedyDetail = lazy(() => import('./pages/RemedyDetail').then(m => ({ default: m.RemedyDetail })));
const Favorites = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const Appointments = lazy(() => import('./pages/Appointments').then(m => ({ default: m.Appointments })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));

/** Wraps a lazy page in its own Suspense so the navbar stays visible during transitions. */
function Page({ children }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[40vh]"><LoadingSkeleton count={2} /></div>}>
      {children}
    </Suspense>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const hasCompletedOnboarding = useAuthStore((state) => state.user?.has_completed_onboarding ?? false);
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function AppRoutes() {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return null;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Page><Landing /></Page>} />
      <Route path="/login" element={<Page><Login /></Page>} />
      <Route path="/register" element={<Page><Register /></Page>} />
      <Route path="/search" element={<Page><SymptomSearch /></Page>} />
      <Route path="/results" element={<Page><Results /></Page>} />
      <Route path="/remedy/:id" element={<Page><RemedyDetail /></Page>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Page><Dashboard /></Page></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Page><Favorites /></Page></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><Page><Appointments /></Page></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Page><Profile /></Page></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminGuard><Page><AdminAnalytics /></Page></AdminGuard></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Page><Onboarding /></Page></ProtectedRoute>} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const fetchAppointments = useAppointmentStore((state) => state.fetchAppointments);
  const clearAppointments = useAppointmentStore((state) => state.clear);
  const fetchCatalog = useCatalogStore((state) => state.fetchCatalog);
  const clearFavorites = useFavoritesStore((state) => state.clear);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    let dispose = () => {};

    initialize().then((cleanup) => {
      dispose = cleanup || (() => {});
      setBootstrapped(true);
    });

    fetchCatalog();

    return () => dispose();
  }, [fetchCatalog, initialize]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearFavorites();
      clearAppointments();
      return;
    }

    fetchFavorites();
    fetchAppointments();
  }, [clearAppointments, clearFavorites, fetchAppointments, fetchFavorites, isAuthenticated]);

  if (!bootstrapped && !isInitialized) {
    return null;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 relative">
          <AppRoutes />
        </main>
        <Suspense fallback={null}>
          <AiChatPanel />
        </Suspense>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
