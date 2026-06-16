import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Navbar, BottomNav, AdminGuard } from './components/layout';
import { useAuthStore } from './store/authStore';
import { useFavoritesStore } from './store/favoritesStore';
import { useAppointmentStore } from './store/appointmentStore';
import { useCatalogStore } from './store/catalogStore';
import { AiChatPanel } from './components/ai/AiChatPanel';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SymptomSearch } from './pages/SymptomSearch';
import { Results } from './pages/Results';
import { RemedyDetail } from './pages/RemedyDetail';
import { Favorites } from './pages/Favorites';
import { Appointments } from './pages/Appointments';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';
import { AdminAnalytics } from './pages/AdminAnalytics';

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

function AnimatedRoutes() {
  const location = useLocation();
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SymptomSearch />} />
        <Route path="/results" element={<Results />} />
        <Route path="/remedy/:id" element={<RemedyDetail />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminGuard><AdminAnalytics /></AdminGuard></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
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
          <AnimatedRoutes />
        </main>
        <AiChatPanel />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
