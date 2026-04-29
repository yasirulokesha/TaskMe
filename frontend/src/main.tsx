import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './features/dashboard/index.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/dashboard" element={<Dashboard/>} />
  </Routes>
  </BrowserRouter>
)
