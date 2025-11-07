import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/usuario.context'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
)

/* registerSW({
  immediate: true,
}) */