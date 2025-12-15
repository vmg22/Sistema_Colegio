import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Container } from 'react-bootstrap';
import '../../styles/breadcrumb.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener segmentos de la URL actual
  let pathnames = location.pathname.split('/').filter(x => x);
  
  // 🧠 BREADCRUMBS INTELIGENTES: Detectar páginas relacionadas con Perfil de Alumno
  const paginasPerfilAlumno = [
    'consulta',
    'asistenciasAlumno',
    'estadoAcademicoAlumno',
    'home-certificados',
    'certificados-AbnEsc',
    'certificados-cCVac',
    'certificadoEscolar',
    'constanciaAlumnoRegular',
    'constanciaAlumnoTramite'
  ];
  
  // Si estamos en una página de perfil de alumno (sin contexto previo)
  const firstSegment = pathnames[0];
  const shouldAddPerfilContext = paginasPerfilAlumno.includes(firstSegment) && 
                                  pathnames.length === 1 && 
                                  !pathnames.includes('perfilAlumno');
  
  // Agregar "perfilAlumno" como contexto antes de la página actual
  if (shouldAddPerfilContext) {
    pathnames = ['perfilAlumno', ...pathnames];
  }
  
  // Si estamos en la raíz o dashboard, no mostrar breadcrumbs
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  // Función para formatear nombres de rutas
  const formatBreadcrumbName = (segment) => {
    // Mapa de nombres personalizados para rutas específicas
    const customNames = {
      'dashboard': 'Dashboard',
      'crud': 'Administración',
      'alumnos': 'Alumnos',
      'materias': 'Materias',
      'docentes': 'Docentes',
      'cursos': 'Cursos',
      'anio-lectivo': 'Año Lectivo',
      'curso-materia': 'Curso-Materia',
      'perfil-alumno': 'Perfil',
      'asistencia-alumno': 'Asistencia',
      'estado-academico': 'Estado Académico',
      'historial-comunicacion': 'Historial de Comunicación',
      'home-certificados': 'Certificados',
      'certificados-AbnEsc': 'Certificado de Abono Escolar',
      'certificados-cCVac': 'Comprobante de Vacante',
      'certificadoEscolar': 'Certificado Escolar',
      'constanciaAlumnoRegular': 'Constancia de Alumno Regular',
      'constanciaAlumnoTramite': 'Constancia en Trámite',
      'generar-mail': 'Generar Email',
      'generar-mail-alumno': 'Generar Email Alumno',
      'enviar-alerta-tutores': 'Alertar Tutores',
      'cursoDashboard': 'Dashboard de Curso',
      'reporte-curso': 'Reportes de Curso',
      'listado': 'Listado',
      'asistencias': 'Asistencias',
      'calificaciones': 'Calificaciones',
      'carga-calificaciones': 'Cargar Calificaciones',
      'carga-asistencias': 'Cargar Asistencias',
      'comunicacion': 'Comunicación',
      'inscripcion-wizard': 'Inscripción',
      'altas-docentes': 'Alta de Docentes',
      'cursos-crud': 'Gestión de Cursos',
      'perfilAlumno': 'Perfil',
      'asistenciasAlumno': 'Asistencias',
      'estadoAcademicoAlumno': 'Estado Académico',
      'consulta': 'Consulta',
      'botones': 'Botones'
    };

    // Si hay un nombre personalizado, usarlo
    if (customNames[segment]) {
      return customNames[segment];
    }

    // Si es un número (ID), retornar "Detalle"
    if (!isNaN(segment)) {
      return 'Detalle';
    }

    // Formatear: reemplazar guiones por espacios y capitalizar
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Función para obtener la ruta padre correcta
  // Esto corrige rutas intermedias que no existen
  const getCorrectRoute = (segment, currentIndex) => {
    // Mapa de rutas que necesitan padre específico
    const parentRouteMap = {
      'reporte-curso': '/cursoDashboard',
      'perfil-alumno': '/perfilAlumno',
    };

    // Si el segmento tiene un padre mapeado, usarlo
    if (parentRouteMap[segment]) {
      return parentRouteMap[segment];
    }

    // Por defecto, construir la ruta normalmente
    return `/${pathnames.slice(0, currentIndex + 1).join('/')}`;
  };

  // Función para manejar navegación
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container fluid className="breadcrumb-container">
      <Breadcrumb className="custom-breadcrumb">
        {/* Siempre mostrar "Inicio" como primer elemento */}
        <Breadcrumb.Item 
          className="breadcrumb-link"
          onClick={() => handleNavigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <i className="bi bi-house-door me-1"></i>
          Inicio
        </Breadcrumb.Item>

        {/* Generar breadcrumbs dinámicamente */}
        {pathnames.map((segment, index) => {
          const routeTo = getCorrectRoute(segment, index);
          const isLast = index === pathnames.length - 1;

          return (
            <Breadcrumb.Item
              key={routeTo}
              active={isLast}
              className={isLast ? 'breadcrumb-active' : 'breadcrumb-link'}
              onClick={() => !isLast && handleNavigate(routeTo)}
              style={{ cursor: isLast ? 'default' : 'pointer' }}
            >
              {formatBreadcrumbName(segment)}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </Container>
  );
};

export default Breadcrumbs;
