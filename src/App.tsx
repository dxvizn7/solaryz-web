import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';
import { Layout } from './components/Layout';
import { BalanceSummary } from './features/dashboard/components/BalanceSummary';
import { LoginForm } from './features/auth/components/Login';
import { RegisterForm } from './features/auth/components/Register';
import { CategoryManagement } from './features/categories/components/CategoryManagement';
import type { JSX } from 'react';
import { Onboarding } from './features/onboarding/pages/Onboarding';
import { Profile } from './features/auth/pages/Profile';
import { LandingPage } from './features/auth/pages/LandingPage';
import { CreditCardsPage } from './features/creditCards/pages/CreditCardsPage';

function Dashboard() {
  return (
    <Layout>
      <BalanceSummary />
    </Layout>
  );
}

function CategoriesPage() {
  return (
    <Layout>
      <CategoryManagement />
    </Layout>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <h1 className="text-white font-semibold text-xl">{title}</h1>
        <p className="text-white/40 text-sm">Esta página está em desenvolvimento.</p>
      </div>
    </Layout>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route 
        path="/onboarding" 
        element={
          <RequireAuth>
            <Onboarding />
          </RequireAuth>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } 
      />

      <Route
        path="/categories"
        element={
          <RequireAuth>
            <CategoriesPage />
          </RequireAuth>
        }
      />

      <Route 
        path="/credit-cards" 
        element={
          <RequireAuth>
            <CreditCardsPage />
          </RequireAuth>
        } 
      />

      <Route path="/transactions" element={<RequireAuth><PlaceholderPage title="Transações" /></RequireAuth>} />
      <Route path="/goals" element={<RequireAuth><PlaceholderPage title="Metas" /></RequireAuth>} />
      <Route path="/accounts" element={<RequireAuth><PlaceholderPage title="Contas" /></RequireAuth>} />
      <Route path="/investments" element={<RequireAuth><PlaceholderPage title="Investimentos" /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><PlaceholderPage title="Configurações" /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

      {/* <-- Rota raiz modificada aqui --> */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        } 
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