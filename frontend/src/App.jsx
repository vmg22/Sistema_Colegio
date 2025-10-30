import './styles/index.css'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ButtonShowcase from './components/ui/Botones'
import Dashboard from './pages/dashboard/Dashboard'
import Header from './components/layout/Header'
import MainCrud from './pages/crud/MainCrud'
import Alumnos from './pages/crud/alumnos/Alumnos'
import Materias from "./pages/crud/materias/Materias"
import PlanEquivalencias from './pages/crud/plan/PlanEquivalencias'
import Docentes from './pages/crud/docentes/Docentes'
import NotFountPage from './pages/NotFoundPage'
import Consulta from './pages/crud/alumnos/Consulta'
import PerfilAlumno from './pages/alumno/PerfilAlumno.jsx'
import AsistenciasAlumno from './pages/alumno/AsistenciaAlumno.jsx'
import EstadoAcademicoPage from './pages/alumno/EstadoAcademicoAlumno.jsx'
import CursoDashboardPage from './pages/curso/CursoDashboardPage.jsx'
import ReporteCursoListPage from './components/curso/ReporteCursoListPage.jsx'
import ResumenCalificacionesPage from './components/curso/ResumenCalificacionesPage.jsx'
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




function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crud" element={<MainCrud />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/docentes" element={<Docentes/>} />
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
          
          

          <Route path="/cursoDashboard" element={<CursoDashboardPage/>} />
          <Route path="/reporte-curso/listado" element={<ReporteCursoListPage />} />
          <Route path="/reporte-curso/calificaciones" element={<ResumenCalificacionesPage />} />

          <Route path="*" element={<NotFountPage/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
