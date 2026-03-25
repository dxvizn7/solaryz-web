import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';
import { Layout } from './components/Layout';
import { BalanceSummary } from './features/dashboard/components/BalanceSummary';
import { LoginForm } from './features/auth/components/Login';
import { RegisterForm } from './features/auth/components/Register';
import type { JSX } from 'react';
import { Onboarding } from './features/onboarding/pages/Onboarding';

function Dashboard() {
  return (
    <Layout>
      <BalanceSummary />
    </Layout>
  );
}

function RequireConnection({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.has_connected_account) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route 
        path="/onboarding" 
        element={
          isAuthenticated && user && !user.has_connected_account 
            ? <Onboarding /> 
            : <Navigate to="/dashboard" replace />
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <RequireConnection>
            <Dashboard />
          </RequireConnection>
        } 
      />

      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;