import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Badge, Card } from 'react-bootstrap'; // Importamos Card para mejor estética
import { useReactToPrint } from 'react-to-print';
import PlanillaImprimible from './PlanillaImprimible';

const PlanillaRegularPreviaView = ({ tipo, datos, cursoNombre, materiaNombre }) => {
    // --- ESTADOS PARA EDICIÓN ---
    const [alumnos, setAlumnos] = useState([]);

    // Fecha editable
    const today = new Date();
    const [fechaDia, setFechaDia] = useState(today.getDate());
    const [fechaMes, setFechaMes] = useState(today.getMonth() + 1);
    const [fechaAnio, setFechaAnio] = useState(today.getFullYear().toString());

    // Títulos editables (inicializados con props o defaults)
    const [editMateria, setEditMateria] = useState(materiaNombre || '');
    const [editCurso, setEditCurso] = useState(cursoNombre || '');

    // Nuevo alumno manual
    const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: '', dni: '' });

    const componentRef = useRef(null);

    // Cargar alumnos cuando llegan los datos (solo si la lista está vacía para no sobrescribir ediciones manuales si re-renderiza)
    useEffect(() => {
        if (Array.isArray(datos) && datos.length > 0) {
            setAlumnos(datos.map(d => ({
                nombre: d.nombre_completo,
                dni: d.dni,
                estado: d.estado
            })));
        }
    }, [datos]);

    // Actualizar estados si cambian las props (ej: cambiar de pestaña), pero permitir edición
    useEffect(() => {
        setEditMateria(materiaNombre || '');
        setEditCurso(cursoNombre || '');
    }, [materiaNombre, cursoNombre]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Planilla_${tipo}_${editMateria}`,
    });

    const handleAddAlumno = () => {
        if (!nuevoAlumno.nombre || !nuevoAlumno.dni) return;
        setAlumnos([...alumnos, { ...nuevoAlumno, estado: 'Agregado Manual' }]);
        setNuevoAlumno({ nombre: '', dni: '' });
    };

    const handleRemoveAlumno = (index) => {
        const newAlumnos = [...alumnos];
        newAlumnos.splice(index, 1);
        setAlumnos(newAlumnos);
    };

    // Datos que se enviarán a la vista de impresión
    const datosImpresion = {
        materia: editMateria || '---',
        curso: editCurso || '---',
        dia: fechaDia,
        mes: fechaMes,
        anio: fechaAnio.slice(-2),
        alumnos: alumnos
    };

    return (
        <Card className="shadow-sm border-0">
            <Card.Body>
                {/* Header de Edición */}
                <div className="mb-4 bg-light p-3 rounded border">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="m-0 fw-bold text-primary">Configurar Planilla: {tipo}</h5>
                        <Button
                            variant="primary"
                            className="d-flex align-items-center fw-bold"
                            onClick={() => handlePrint()}
                        >
                            <span className="material-symbols-outlined me-2">print</span>
                            Imprimir Planilla
                        </Button>
                    </div>

                    <div className="row g-3">
                        {/* Campos de Título */}
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Asignatura:</label>
                            <input
                                type="text" className="form-control"
                                value={editMateria} onChange={e => setEditMateria(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Curso:</label>
                            <input
                                type="text" className="form-control"
                                value={editCurso} onChange={e => setEditCurso(e.target.value)}
                            />
                        </div>
                        {/* Campos de Fecha */}
                        <div className="col-md-5">
                            <label className="form-label small fw-bold">Fecha de Examen (D/M/A):</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="number" className="form-control text-center" placeholder="DD"
                                    value={fechaDia} onChange={e => setFechaDia(e.target.value)}
                                />
                                <input
                                    type="number" className="form-control text-center" placeholder="MM"
                                    value={fechaMes} onChange={e => setFechaMes(e.target.value)}
                                />
                                <input
                                    type="number" className="form-control text-center" placeholder="AAAA"
                                    value={fechaAnio} onChange={e => setFechaAnio(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gestión de Alumnos */}
                <div className="mb-3">
                    <div className="input-group">
                        <input
                            type="text" className="form-control" placeholder="Nombre del Alumno"
                            value={nuevoAlumno.nombre} onChange={e => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
                        />
                        <input
                            type="text" className="form-control" placeholder="DNI" style={{ maxWidth: '150px' }}
                            value={nuevoAlumno.dni} onChange={e => setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })}
                        />
                        <Button variant="outline-success" onClick={handleAddAlumno}>
                            <span className="material-symbols-outlined align-middle">add_circle</span> Agregar
                        </Button>
                    </div>
                </div>

                {alumnos.length === 0 ? (
                    <div className="alert alert-warning border-0 shadow-sm">
                        La lista está vacía. Mueva alumnos a la lista o agregue manualmente.
                    </div>
                ) : (
                    <Table hover responsive className="align-middle small">
                        <thead className="table-light">
                            <tr>
                                <th className="text-center" style={{ width: '40px' }}>#</th>
                                <th style={{ width: '100px' }}>DNI</th>
                                <th>Alumno</th>
                                <th className="text-center">Origen</th>
                                <th className="text-center" style={{ width: '40px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map((d, i) => (
                                <tr key={i}>
                                    <td className="text-center text-muted">{i + 1}</td>
                                    <td>{d.dni}</td>
                                    <td className="fw-semibold">{d.nombre}</td>
                                    <td className="text-center">
                                        <Badge bg={d.estado === 'Agregado Manual' ? 'info' : 'secondary'}>
                                            {d.estado || 'Auto'}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <Button variant="link" className="text-danger p-0" onClick={() => handleRemoveAlumno(i)}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {/* CONTENEDOR DE IMPRESIÓN (OCULTO) */}
                <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                    <div ref={componentRef}>
                        <PlanillaImprimible
                            tipo={tipo}
                            datos={datosImpresion}
                        />
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlanillaRegularPreviaView;