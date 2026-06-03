import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import keycloak from '@/lib/keycloak'
import '@/index.css'
import App from './App.tsx'

keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256' }).then((authenticated) => {
  if (!authenticated) {
    keycloak.login()
    return
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
