import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { useConsultaStore } from "../../store/consultaStore";
import { obtenerCandidatosPrevia } from '../../services/planillasService';
import PlanillaNivelacionForm from '../../components/planillas/PlanillaNivelacionForm';
import PlanillaRegularPreviaView from '../../components/planillas/PlanillaRegularPreviaView';
import EncabezadoPreviasCurso from "../../components/curso/EncabezadoPreviasCurso"; // Reusar encabezado

const PlanillasPage = () => {
    const {
        reporteCurso,
        selectedCursoNombre,
        selectedMateriaNombre
    } = useConsultaStore();
    const [key, setKey] = useState('previa'); // Default ahora es previa

    // Datos data tables
    const [datosPrevia, setDatosPrevia] = useState([]);

    // Filtros
    const filtros = useMemo(() => {
        if (!reporteCurso?.filtros) return null;
        return {
            curso: reporteCurso.filtros.curso,
            materia: reporteCurso.filtros.materia,
            anioLectivo: reporteCurso.filtros.anioLectivo
        };
    }, [reporteCurso]);

    const materiaNombre = selectedMateriaNombre || 'Materia Seleccionada';
    const cursoNombre = selectedCursoNombre || 'Curso Seleccionado';

    useEffect(() => {
        if (!filtros) return;

        if (key === 'previa') {
            obtenerCandidatosPrevia(filtros.anioLectivo, filtros.curso, filtros.materia)
                .then(setDatosPrevia)
                .catch(err => console.error(err));
        }
    }, [key, filtros]);

    if (!filtros) {
        return <div className="alert alert-danger m-3">Por favor seleccione un curso y materia desde el buscador.</div>;
    }

    return (
        <div className="nombre_vista">
            <div className="curso-dashboard-header">
                <span className="material-symbols-outlined curso-dashboard-icon">
                    description
                </span>
                <h2 className="curso-dashboard-title">Generación de Actas Volantes</h2>
            </div>

            <EncabezadoPreviasCurso />

            <div className="container mt-4" style={{ maxWidth: '1000px' }}>
                <Tabs
                    id="planillas-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3 custom-tabs"
                    fill
                >
                    <Tab eventKey="previa" title="Reg. Previa (Dic/Feb/Mar)">
                        <PlanillaRegularPreviaView
                            tipo="PREVIA"
                            datos={datosPrevia}
                            cursoNombre={cursoNombre}
                            materiaNombre={materiaNombre}
                            anioLectivo={filtros.anioLectivo}
                        />
                    </Tab>
                    <Tab eventKey="nivelacion" title="Reg. Nivelación (Manual)">
                        <PlanillaNivelacionForm filtros={filtros} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default PlanillasPage;
