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
import ConstAluTramite from './pages/alumno/ConstAluTramite.jsx'
import AsistenciaAlumno from './pages/alumno/AsistenciaAlumno'
import EstadoAcademicoAlumno from './pages/alumno/EstadoAcademicoAlumno'
import HistorialComunicaciones from './pages/alumno/HistorialComunicaciones'
import CursoPrincipal from './pages/curso/CursoPrincipal.jsx'
import AsistenciaCurso from './pages/curso/AsistenciaCurso.jsx'
import NotasCurso from './pages/curso/NotasCurso.jsx'


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
          <Route path="/consulta-alumno" element={<Consulta/>} />
          <Route path="/asistencia-alumno" element={<AsistenciaAlumno/>} />
          <Route path="/estado-academico" element={<EstadoAcademicoAlumno/>} />
          <Route path="/historial-comunicaciones" element={<HistorialComunicaciones/>} />
          <Route path="/constanciaAlumnoTramite" element={<ConstAluTramite/>} />
          <Route path="/consulta-curso" element={<CursoPrincipal/>} />
          <Route path="/asistencia-curso" element={<AsistenciaCurso/>} />
          <Route path="/notas-curso" element={<NotasCurso/>} />

          
          <Route path="*" element={<NotFountPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
