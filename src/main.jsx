import { createRoot } from 'react-dom/client'
import { PelangganProvider } from './pages/pelanggan/PelangganContext.jsx'
import { AuthProvider } from './pages/auth/AuthContext.jsx'
// import './index.css'
//import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
  <AuthProvider>
    <PelangganProvider>
    <App />
  </PelangganProvider>
  </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>

);
