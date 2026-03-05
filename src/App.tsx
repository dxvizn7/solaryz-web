import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';
import { Layout } from './components/Layout';
import { AccountSummary } from './features/dashboard/components/AccountSummary';
import { LoginForm } from './features/auth/components/Login';
import { RegisterForm } from './features/auth/components/Register';
import type { JSX } from 'react';
import { PluggyConnectButton } from './features/accounts/components/PluggyConnect';

function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 items-start">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-right">
           {/* <PluggyConnectButton  /> */}
          </div>
        </div>
        
        <div className="flex gap-6 items-start">
          <AccountSummary />
        </div>
      </div>
    </Layout>
  );
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
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
      {/* O AuthProvider abraça tudo para fornecer o estado */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;