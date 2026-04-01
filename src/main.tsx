import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotificationProvider } from './contexts/NotificationContext'
import { NotificationContainer } from './components/SolaryzNotification/NotificationContainer'

const queryClient = new QueryClient()

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <App />
          <NotificationContainer />
        </NotificationProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)