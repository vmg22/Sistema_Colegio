import './styles/index.css'
import "./App.css"
import Navv from './components/layout/Navv'
import ButtonShowcase from './components/ui/Botones'
import Dashboard from './pages/dashboard/Dashboard'
import Header from './components/layout/Header'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { DocenteProvider } from './context/DocenteContext';

import Admin from './pages/admin/Admin';

function App() {

  return (
    <>
      <Header />
      <DocenteProvider>

          <BrowserRouter>
            <Routes>
              
              {/* 4. Configura tu página de Admin como la ruta principal ("/") */}
              <Route path="/" element={<Admin />} />

              {/* Puedes añadir otras rutas de prueba aquí si lo necesitas */}
              <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            
            </Routes>
          </BrowserRouter>
      </DocenteProvider>
      
    </>
  );
}

export default App 