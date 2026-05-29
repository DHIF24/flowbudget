import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  Outlet 
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 1. Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';

// 2. Navigation Frame Components
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';

// 3. Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Categories from './pages/Categories';
import History from './pages/History';
import Settings from './pages/Settings';

/**
 * Ensures access only to signed-in users
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-zinc-950 text-slate-500 font-medium">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <BudgetProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans overflow-x-hidden">
        {/* Left Sidebar on Desktop */}
        <Sidebar />

        {/* Content Panel */}
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl w-full mx-auto pb-28 sm:pb-24 md:pb-8 overflow-x-hidden">
            <Outlet />
          </main>
        </div>

        {/* Bottom Navigation on Mobile */}
        <BottomNav />
      </div>
    </BudgetProvider>
  );
}

/**
 * Restricts access to non-logged users (redirects from /login to /dashboard if logged)
 */
function OpenRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-zinc-950 text-slate-500">
        Chargement...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  // Theme is initialized in index.html before React loads

  return (
    <Router>
      <AuthProvider>
        {/* Toaster element positioning */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '12px',
              fontSize: '13px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
            },
            className: 'dark:!bg-zinc-900 dark:!text-zinc-100 dark:!border-zinc-800'
          }}
        />

        <Routes>
          {/* Public / Open Authentication Routes */}
          <Route element={<OpenRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Secure Protected Business Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback Catch */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
