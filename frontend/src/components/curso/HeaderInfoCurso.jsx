import React from 'react'
import { useState, useEffect } from 'react'
import { useConsultaStore } from '../../store/consultaStore'
import { Spinner } from 'react-bootstrap'
import BtnVolver from '../ui/BtnVolver'
import { getMateriasId } from '../../services/materiasServices'
import { getCursosId } from '../../services/cursosService'

const HeaderInfoCurso = () => {
    const {reporteCurso} = useConsultaStore()
    const [reporte, setReporte] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [nombreMateria, setNombreMateria] = useState(null);
    const [loadingMateria, setLoadingMateria] = useState(true);
    const [nombreCurso, setNombreCurso] = useState(null);
    const [loadingCurso, setLoadingCurso] = useState(true);

    useEffect(() => {
        // Este useEffect se queda igual. Carga el reporte principal.
        let dataToSet = null;

        if (reporteCurso) {
          dataToSet = reporteCurso;
        } else {
          const storedData = sessionStorage.getItem("reporteCurso");
          if (storedData) {
            dataToSet = JSON.parse(storedData);
          }
        }

        setReporte(dataToSet);
        setLoading(false); 
    }, [reporteCurso]);

    useEffect(() => {
        // Solo se ejecuta cuando 'reporte' tiene datos
        if (reporte && reporte.filtros) {
            
            // --- Función para buscar Nombre de Materia ---
            const fetchNombreMateria = async () => {
                if (!reporte.filtros.materia) {
                    setLoadingMateria(false);
                    setNombreMateria("N/A");
                    return;
                }
                try {
                    setLoadingMateria(true);
                    const dataMateria = await getMateriasId(reporte.filtros.materia);
                    if (dataMateria) { 
                        setNombreMateria(dataMateria.nombre); 
                    } else {
                        setNombreMateria("Materia no encontrada");
                    }
                } catch (error) {
                    console.error("Error al buscar nombre de materia:", error);
                    setNombreMateria("Error al cargar");
                } finally {
                    setLoadingMateria(false);
                }
            };

            // --- Función para buscar Nombre de Curso ---
            const fetchNombreCurso = async () => {
                if (!reporte.filtros.curso) {
                    setLoadingCurso(false);
                    setNombreCurso("N/A");
                    return;
                }
                try {
                    setLoadingCurso(true);
                    // Asumimos que tienes un servicio 'getCursosId'
                    const dataCurso = await getCursosId(reporte.filtros.curso);
                    
                    if (dataCurso) { 
                        // Asegúrate de que la propiedad sea '.nombre'
                        // (o quizás '.anio' + '.division' si tu API devuelve eso)
                        setNombreCurso(dataCurso.nombre); 
                    } else {
                        setNombreCurso("Curso no encontrado");
                    }
                } catch (error) {
                    console.error("Error al buscar nombre de curso:", error);
                    setNombreCurso("Error al cargar");
                } finally {
                    setLoadingCurso(false);
                }
            };

            // --- Llamamos a las dos funciones ---
            fetchNombreMateria();
            fetchNombreCurso();
        }
    }, [reporte]); // <-- Sigue dependiendo solo de 'reporte'

    if (loading) {
        return (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando reporte...</p>
          </div>
        );
    }

    if (!reporte) {
        return (
          <div className="text-center mt-5">
            <h5>No se encontraron datos del curso.</h5>
            <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
            <BtnVolver rutaVolver={"/consulta-curso"} />
          </div>
        );
    }

// console.log(nombreCurso)

    console.log("Datos del curso:", reporte.filtros);

    return (
         <div className="card">
            <div className="card-body ">
                <div className="row d-flex justify-content-around">
                    <div className="col-md-3">
                        <small className="text-muted">Materia</small>
                        <h6 className="mb-0">{nombreMateria}</h6>
                    </div>
                    <div className="col-md-3">
                        <small className="text-muted">Curso</small>
                        <h6 className="mb-0">{nombreCurso}</h6>
                    </div>
                    <div className="col-md-3">
                        <small className="text-muted">Período</small>
                        {reporte.cuatrimestre == 1 ? 
                        <h6 className="mb-0">
                            Primer Cuatrimestre - {reporte.filtros.anioLectivo}
                        </h6>
                        :
                        <h6 className="mb-0">
                            Segundo Cuatrimestre - {reporte.filtros.anioLectivo}
                        </h6>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderInfoCurso