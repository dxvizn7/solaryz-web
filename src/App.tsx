import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';
import { Layout } from './components/Layout';
import { AccountSummary } from './features/dashboard/components/AccountSummary';
import { LoginForm } from './features/auth/components/Login';
import { RegisterForm } from './features/auth/components/Register';
import type { JSX } from 'react';
import { Onboarding } from './features/onboarding/pages/Onboarding';

// O Dashboard agora fica limpo, focado só em exibir os dados!
function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 items-start">
        <div className="flex gap-6 items-start">
          <AccountSummary />
        </div>
      </div>
    </Layout>
  );
}

// 1. O PrivateRoute evoluiu para RequireConnection
function RequireConnection({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuth();

  // Se não tem token, joga pro login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se tá logado mas a flag de conta conectada é falsa, prende no Onboarding!
  if (user && !user.has_connected_account) {
    return <Navigate to="/onboarding" replace />;
  }

  // Passou em tudo? Renderiza o Dashboard.
  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* 2. Rota do Onboarding com proteção invertida: 
          Só deixa acessar se estiver logado e NÃO tiver conta conectada. 
          Se já tiver conta, chuta pro dashboard! */}
      <Route 
        path="/onboarding" 
        element={
          isAuthenticated && user && !user.has_connected_account 
            ? <Onboarding /> 
            : <Navigate to="/dashboard" replace />
        } 
      />

      {/* 3. Aplicando o nosso guarda-costas no Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <RequireConnection>
            <Dashboard />
          </RequireConnection>
        } 
      />

      {/* 4. A rota principal decide pra onde mandar baseado no login */}
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
      {/* O AuthProvider abraça tudo para fornecer o estado */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;