import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Badge, Card } from 'react-bootstrap'; // Importamos Card para mejor estética
import { useReactToPrint } from 'react-to-print';
import PlanillaImprimible from './PlanillaImprimible';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Cargar alumnos cuando llegan los datos
    useEffect(() => {
        if (Array.isArray(datos) && datos.length > 0) {
            setAlumnos(datos.map(d => ({
                nombre: d.nombre_completo,
                dni: d.dni,
                estado: d.estado
            })));
        }
    }, [datos]);

    // Actualizar estados si cambian las props
    useEffect(() => {
        setEditMateria(materiaNombre || '');
        setEditCurso(cursoNombre || '');
    }, [materiaNombre, cursoNombre]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Planilla_${tipo}_${editMateria}`,
    });

    const handleDownloadPDF = async () => {
        if (!componentRef.current) return;
        setIsGeneratingPdf(true);

        try {
            // 1. Crear un clon del elemento para 'limpiar' el contexto (escalas, flex, etc.)
            const original = componentRef.current;
            const clone = original.cloneNode(true);

            // 2. Configurar estilos para que el clon sea A4 perfecto y visible para html2canvas
            Object.assign(clone.style, {
                position: 'fixed',
                top: '-10000px', // Fuera de pantalla pero renderizado
                left: '-10000px',
                width: '210mm',
                minHeight: '297mm',
                height: 'auto',
                transform: 'none',
                margin: '0',
                padding: '0',
                backgroundColor: 'white',
                zIndex: '-1000'
            });

            // Necesitamos meter el estilo de media print también, o asegurar que el CSS inline baste.
            // Al clonar, se llevan los estilos inline.
            document.body.appendChild(clone);

            // 3. Capturar con html2canvas
            const canvas = await html2canvas(clone, {
                scale: 2, // Mejor calidad
                useCORS: true,
                logging: false,
                windowWidth: 794, // 210mm @ 96 DPI aprox
                windowHeight: 1123 // 297mm @ 96 DPI aprox
            });

            // 4. Limpiar
            document.body.removeChild(clone);

            // 5. Generar PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Planilla_${editMateria.replace(/\s+/g, '_')}_${editCurso.replace(/\s+/g, '_')}.pdf`);

        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Error al generar el PDF. Por favor intente imprimir.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

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
                <div className="mb-4">
                    <h5 className="m-0 fw-bold" style={{ color: '#303F9F' }}>Configurar y Visualizar Planilla: {tipo}</h5>
                </div>

                <div className="row">
                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
                    <div className="col-lg-5 mb-4">
                        <div className="bg-light p-3 rounded border mb-3">
                            <h6 className="fw-bold mb-3" style={{ color: '#303F9F' }}>1. Datos del Encabezado</h6>
                            <div className="mb-2">
                                <label className="form-label small fw-bold">Asignatura:</label>
                                <input
                                    type="text" className="form-control"
                                    value={editMateria} onChange={e => setEditMateria(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small fw-bold">Curso:</label>
                                <input
                                    type="text" className="form-control"
                                    value={editCurso} onChange={e => setEditCurso(e.target.value)}
                                />
                            </div>
                            <div className="mb-2">
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

                        <div className="bg-light p-3 rounded border">
                            <h6 className="fw-bold mb-3" style={{ color: '#303F9F' }}>2. Gestión de Alumnos</h6>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre Completo:</label>
                                <input
                                    type="text" className="form-control mb-2" placeholder="Ej: Perez, Juan"
                                    value={nuevoAlumno.nombre} onChange={e => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
                                />
                                <div className="d-flex gap-2">
                                    <div className="flex-grow-1">
                                        <input
                                            type="text" className="form-control" placeholder="DNI"
                                            value={nuevoAlumno.dni} onChange={e => setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })}
                                        />
                                    </div>
                                    <Button variant="success" onClick={handleAddAlumno} className="d-flex align-items-center">
                                        <span className="material-symbols-outlined me-1">add</span> Añadir
                                    </Button>
                                </div>
                            </div>

                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {alumnos.length === 0 ? (
                                    <div className="alert alert-warning small">Lista vacía. Agregue alumnos.</div>
                                ) : (
                                    <Table hover size="sm" className="small bg-white">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '20px' }}>#</th>
                                                <th>Alumno</th>
                                                <th>DNI</th>
                                                <th style={{ width: '30px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alumnos.map((d, i) => (
                                                <tr key={i}>
                                                    <td className="align-middle text-muted">{i + 1}</td>
                                                    <td className="align-middle">{d.nombre}</td>
                                                    <td className="align-middle">{d.dni}</td>
                                                    <td className="text-center">
                                                        <Button variant="link" className="text-danger p-0" size="sm" onClick={() => handleRemoveAlumno(i)}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: VISTA PREVIA EN VIVO (STICKY) */}
                    <div className="col-lg-7">
                        <div style={{ position: 'sticky', top: '20px' }}>
                            {/* BOTONES DE ACCIÓN */}
                            <div className="d-flex gap-2 justify-content-end mb-3">
                                <Button
                                    variant="outline-danger"
                                    className="d-flex align-items-center fw-bold"
                                    onClick={handleDownloadPDF}
                                    disabled={isGeneratingPdf}
                                >
                                    {isGeneratingPdf ? (
                                        <span className="spinner-border spinner-border-sm me-2" />
                                    ) : (
                                        <span className="material-symbols-outlined me-2">download</span>
                                    )}
                                    Descargar PDF
                                </Button>
                                <Button
                                    variant="primary"
                                    className="d-flex align-items-center fw-bold"
                                    onClick={() => handlePrint()}
                                >
                                    <span className="material-symbols-outlined me-2">print</span>
                                    Imprimir Planilla
                                </Button>
                            </div>

                            <div className="border rounded bg-secondary bg-opacity-10 p-2 d-flex flex-column">
                                <h6 className="text-center fw-bold mb-2" style={{ color: '#303F9F' }}>
                                    <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: '1.2rem' }}>visibility</span>
                                    Vista Previa de Impresión
                                </h6>

                                {/* Contenedor sin scroll para mostrar la hoja A4 completa */}
                                <div className="d-flex justify-content-center align-items-start" style={{ background: '#525659', padding: '20px', borderRadius: '4px' }}>

                                    <div style={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        padding: '0',
                                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                                        marginBottom: '20px'
                                    }}>
                                        {/* Aquí renderizamos el componente imprimible REAL */}
                                        <div ref={componentRef} style={{ width: '100%', minHeight: '297mm', overflow: 'hidden' }}>
                                            <PlanillaImprimible
                                                tipo={tipo}
                                                datos={datosImpresion}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PlanillaRegularPreviaView;