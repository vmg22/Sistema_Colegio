import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../ui/BtnVolver";
import { getMateriasId } from "../../services/materiasServices";
import { getCursosId } from "../../services/cursosService";

const HeaderInfoCurso = () => {
  const { reporteCurso } = useConsultaStore();

  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nombreMateria, setNombreMateria] = useState(null);
  const [loadingMateria, setLoadingMateria] = useState(true);

  const [nombreCurso, setNombreCurso] = useState(null);
  const [loadingCurso, setLoadingCurso] = useState(true);

  // Cargar reporte desde Zustand o sessionStorage
  useEffect(() => {
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

  // Cargar nombres de Materia y Curso
  useEffect(() => {
    if (!reporte?.filtros) return;

    const fetchNombreMateria = async () => {
      if (!reporte.filtros.materia) {
        setNombreMateria("N/A");
        setLoadingMateria(false);
        return;
      }

      try {
        setLoadingMateria(true);
        const dataMateria = await getMateriasId(reporte.filtros.materia);
        setNombreMateria(dataMateria?.nombre || "Materia no encontrada");
      } catch (error) {
        console.error("Error al buscar nombre de materia:", error);
        setNombreMateria("Error al cargar");
      } finally {
        setLoadingMateria(false);
      }
    };

    const fetchNombreCurso = async () => {
      if (!reporte.filtros.curso) {
        setNombreCurso("N/A");
        setLoadingCurso(false);
        return;
      }

      try {
        setLoadingCurso(true);
        const dataCurso = await getCursosId(reporte.filtros.curso);
        setNombreCurso(dataCurso?.nombre || "Curso no encontrado");
      } catch (error) {
        console.error("Error al buscar nombre de curso:", error);
        setNombreCurso("Error al cargar");
      } finally {
        setLoadingCurso(false);
      }
    };

    fetchNombreMateria();
    fetchNombreCurso();
  }, [reporte]);

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
        <BtnVolver rutaVolver="/consulta-curso" />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="row d-flex justify-content-around">
          <div className="col-md-3">
            <small className="text-muted">Materia</small>
            <h6 className="mb-0">
              {loadingMateria ? "Cargando..." : nombreMateria}
            </h6>
          </div>
          <div className="col-md-3">
            <small className="text-muted">Curso</small>
            <h6 className="mb-0">
              {loadingCurso ? "Cargando..." : nombreCurso}
            </h6>
          </div>
          <div className="col-md-3">
            <small className="text-muted">Período</small>
            <h6 className="mb-0">
              {reporte.cuatrimestre === 1
                ? `Primer Cuatrimestre - ${reporte.filtros.anioLectivo}`
                : `Segundo Cuatrimestre - ${reporte.filtros.anioLectivo}`}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderInfoCurso;
