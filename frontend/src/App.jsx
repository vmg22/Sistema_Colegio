import './styles/index.css'
import './App.css'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import ButtonShowcase from './components/ui/Botones'
import Dashboard from './pages/dashboard/Dashboard'
import Header from './components/layout/Header'
import MainCrud from './pages/crud/MainCrud'
import Alumnos from './pages/crud/alumnos/Alumnos'
import Materias from "./pages/crud/materias/Materias"
import PlanEquivalencias from './pages/crud/plan/PlanEquivalencias'
import Docentes from './pages/crud/docentes/Docentes.jsx'
import NotFountPage from './pages/NotFoundPage'
import Consulta from './pages/crud/alumnos/Consulta'
import PerfilAlumno from './pages/alumno/PerfilAlumno.jsx'
import AsistenciasAlumno from './pages/alumno/AsistenciaAlumno.jsx'
import EstadoAcademicoPage from './pages/alumno/EstadoAcademicoAlumno.jsx'
import CursoDashboardPage from './pages/curso/CursoDashboardPage.jsx'
import ReporteCursoListPage from './components/curso/ReporteCursoListPage.jsx'
import ResumenCalificacionesPage from './components/curso/ResumenCalificacionesPage.jsx'
import ResumenAsistenciasPage from './components/curso/ResumenAsistenciasPage.jsx'
import CargaCalificaciones from './pages/curso/CargaCalificaciones.jsx'

import DocentePerfil from './pages/docentes/DocentePerfil.jsx'

import AsistenciaAlumno from './pages/alumno/AsistenciaAlumno'
import EstadoAcademicoAlumno from './pages/alumno/EstadoAcademicoAlumno'
import HistorialComunicaciones from './pages/alumno/HistorialComunicaciones'
import HomeCertificados from './pages/alumno/HomeCertificados.jsx'
import CertificadoAbonoEscolar from './pages/alumno/certificadoAbonoEscolar.jsx'
import CertificadoComprobanteDeVacante from './pages/alumno/certificadoComprobanteDeVacante.jsx'
import ConstAluTramite from './pages/alumno/ConstAluTramite.jsx'
import ActaVolanteExamen from './pages/alumno/actaVolanteExamen.jsx'
import ConstanciaAlumnoRegular from './pages/alumno/constanciaAlumnoRegular.jsx'
import CertificadoEscolar from './pages/alumno/certificadoEscolar.jsx'
import GenerarMail from "./pages/alumno/generarmail.jsx";
import CursoComunicacion from './pages/curso/CursoComunicacion.jsx'
<<<<<<< HEAD
import EnviarAlertaTutoresPage from './pages/curso/EnviarAlertaTutoresPage.jsx'

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


=======
import Login from './pages/alumno/login.jsx'
import OlvideContrasena from './pages/alumno/olvideContraseña.jsx'
import SolicitarRecuperacion from './pages/alumno/solicitarRecuperacion.jsx'
>>>>>>> 85bc75fffbb437a8789101577596033a1a2da662

import InscripcionWizard from './components/crud/InscripcionWizard.jsx'

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const location = useLocation()
  
  // Rutas donde NO queremos mostrar el Header
  const rutasSinHeader = ['/', '/login', '/reset-password', '/solicitar-reset']
  const mostrarHeader = !rutasSinHeader.includes(location.pathname)

  return (
    <>
<<<<<<< HEAD
    <ToastContainer />
      <Header />
      
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crud" element={<MainCrud />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/docentes" element={<Docentes />} />
          <Route path="/materias" element={<Materias/>} />
          <Route path="/plan-de-equivalencias" element={<PlanEquivalencias/>} />
          <Route path="/botones" element={<ButtonShowcase />} />
          <Route path="/consulta" element={<Consulta/>} />
          <Route path="/constanciaAlumnoTramite" element={<ConstAluTramite/>} />
          <Route path="/perfilAlumno" element={<PerfilAlumno/>} />
          <Route path="/asistenciasAlumno" element={<AsistenciasAlumno/>} />
          <Route path="/estadoAcademicoAlumno" element={<EstadoAcademicoPage/>} />
          <Route path="/asistencia-alumno" element={<AsistenciaAlumno/>} />
          <Route path="/estado-academico" element={<EstadoAcademicoAlumno/>} />
          <Route path="/historial-comunicaciones" element={<HistorialComunicaciones/>} />
          <Route path="/home-certificados" element={<HomeCertificados/>} />
          <Route path="/certificados-AbnEsc" element={<CertificadoAbonoEscolar/>} />
          <Route path="/certificados-ActVolEx" element={<ActaVolanteExamen/>} />
          <Route path="/constanciaAlumnoRegular" element={<ConstanciaAlumnoRegular/>} />
          <Route path="/certificadoEscolar" element={<CertificadoEscolar/>} />
          <Route path="/certificados-cCVac" element={<CertificadoComprobanteDeVacante/>} />
          <Route path="/perfil-alumno/generar-mail" element={<GenerarMail/>} />
          
          

          <Route path="/cursoDashboard" element={<CursoDashboardPage/>} />
          <Route path="/reporte-curso/listado" element={<ReporteCursoListPage />} />
          <Route path="/reporte-curso/Asistencias" element={<ResumenAsistenciasPage />} />
          <Route path="/reporte-curso/calificaciones" element={<ResumenCalificacionesPage />} />
          <Route path="reporte-curso/carga-calificaciones" element={<CargaCalificaciones />} />
          <Route path="reporte-curso/comunicacion" element={<CursoComunicacion />} />
          <Route path="/reporte-curso/alertaTutoresPage" element={<EnviarAlertaTutoresPage />} />
=======
      {mostrarHeader && <Header />}
      
      <Routes>
        {/* Rutas públicas (sin protección) */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<OlvideContrasena />} />
        <Route path="/solicitar-reset" element={<SolicitarRecuperacion />} />
>>>>>>> 85bc75fffbb437a8789101577596033a1a2da662
        
        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/crud" element={<ProtectedRoute><MainCrud /></ProtectedRoute>} />
        <Route path="/alumnos" element={<ProtectedRoute><Alumnos /></ProtectedRoute>} />
        <Route path="/docentes" element={<ProtectedRoute><Docentes /></ProtectedRoute>} />
        <Route path="/materias" element={<ProtectedRoute><Materias/></ProtectedRoute>} />
        <Route path="/plan-de-equivalencias" element={<ProtectedRoute><PlanEquivalencias/></ProtectedRoute>} />
        <Route path="/botones" element={<ProtectedRoute><ButtonShowcase /></ProtectedRoute>} />
        <Route path="/consulta" element={<ProtectedRoute><Consulta/></ProtectedRoute>} />
        <Route path="/constanciaAlumnoTramite" element={<ProtectedRoute><ConstAluTramite/></ProtectedRoute>} />
        <Route path="/perfilAlumno" element={<ProtectedRoute><PerfilAlumno/></ProtectedRoute>} />
        <Route path="/asistenciasAlumno" element={<ProtectedRoute><AsistenciasAlumno/></ProtectedRoute>} />
        <Route path="/estadoAcademicoAlumno" element={<ProtectedRoute><EstadoAcademicoPage/></ProtectedRoute>} />
        <Route path="/asistencia-alumno" element={<ProtectedRoute><AsistenciaAlumno/></ProtectedRoute>} />
        <Route path="/estado-academico" element={<ProtectedRoute><EstadoAcademicoAlumno/></ProtectedRoute>} />
        <Route path="/historial-comunicaciones" element={<ProtectedRoute><HistorialComunicaciones/></ProtectedRoute>} />
        <Route path="/home-certificados" element={<ProtectedRoute><HomeCertificados/></ProtectedRoute>} />
        <Route path="/certificados-AbnEsc" element={<ProtectedRoute><CertificadoAbonoEscolar/></ProtectedRoute>} />
        <Route path="/certificados-ActVolEx" element={<ProtectedRoute><ActaVolanteExamen/></ProtectedRoute>} />
        <Route path="/constanciaAlumnoRegular" element={<ProtectedRoute><ConstanciaAlumnoRegular/></ProtectedRoute>} />
        <Route path="/certificadoEscolar" element={<ProtectedRoute><CertificadoEscolar/></ProtectedRoute>} />
        <Route path="/certificados-cCVac" element={<ProtectedRoute><CertificadoComprobanteDeVacante/></ProtectedRoute>} />
        <Route path="/perfil-alumno/generar-mail" element={<ProtectedRoute><GenerarMail/></ProtectedRoute>} />
        
        <Route path="/cursoDashboard" element={<ProtectedRoute><CursoDashboardPage/></ProtectedRoute>} />
        <Route path="/reporte-curso/listado" element={<ProtectedRoute><ReporteCursoListPage /></ProtectedRoute>} />
        <Route path="/reporte-curso/Asistencias" element={<ProtectedRoute><ResumenAsistenciasPage /></ProtectedRoute>} />
        <Route path="/reporte-curso/calificaciones" element={<ProtectedRoute><ResumenCalificacionesPage /></ProtectedRoute>} />
        <Route path="reporte-curso/carga-calificaciones" element={<ProtectedRoute><CargaCalificaciones /></ProtectedRoute>} />
        <Route path="reporte-curso/comunicacion" element={<ProtectedRoute><CursoComunicacion /></ProtectedRoute>} />
        <Route path="/inscripcion-wizard" element={<ProtectedRoute><InscripcionWizard /></ProtectedRoute>} />
      
        <Route path="/docentes/:id" element={<ProtectedRoute><DocentePerfil /></ProtectedRoute>} />
        <Route path="*" element={<NotFountPage/>} />
      </Routes>
    </>
  )
}

export default App

