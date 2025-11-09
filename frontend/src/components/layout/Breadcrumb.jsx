import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../../styles/breadcrumb.css';

// Diccionario para traducir rutas a nombres legibles
const routeNames = {
    'docentes': 'Docentes',
    'alumnos': 'Alumnos',
    'materias': 'Materias',
    'cursos': 'Cursos',
    'asignaciones': 'Asignaciones',
    'perfil': 'Perfil',
    'nuevo': 'Nuevo',
    'editar': 'Editar'
    // Añade aquí cualquier otra ruta base que tengas
};

const Breadcrumb = ({ customLastItem }) => {
    const location = useLocation();
    
    // Dividimos la URL en partes (ej: "/docentes/8" -> ["", "docentes", "8"])
    // Filtramos los strings vacíos
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {/* 1. Siempre mostramos el Inicio */}
                <li className="breadcrumb-item">
                    <Link to="/">Inicio</Link>
                </li>

                {/* 2. Generamos los items intermedios */}
                {pathnames.map((value, index) => {
                    const isLast = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    // Intentamos traducir el nombre. Si es un número (ID), lo llamamos "Detalle" temporalmente
                    let displayName = routeNames[value] || value;
                    if (!isNaN(value)) {
                        displayName = "Detalle"; 
                    }

                    // Si es el último item y tenemos un nombre personalizado (ej. el nombre del docente), lo usamos
                    if (isLast && customLastItem) {
                        displayName = customLastItem;
                    }

                    // Capitalizar si no estaba en el diccionario
                    if (!routeNames[value] && isNaN(value)) {
                         displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                    }

                    return isLast ? (
                        // El último item NO es un enlace
                        <li key={to} className="breadcrumb-item active" aria-current="page">
                            {displayName}
                        </li>
                    ) : (
                        // Los items intermedios SÍ son enlaces
                        <li key={to} className="breadcrumb-item">
                            <Link to={to}>{displayName}</Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;