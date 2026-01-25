import React, { useState, useRef, useMemo } from 'react';
import { Form, Button, Table, Row, Col, Card } from 'react-bootstrap';

import { useReactToPrint } from 'react-to-print';
import PlanillaImprimible from './PlanillaImprimible';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PlanillaNivelacionForm = ({ filtros, onSuccess, cursoNombre, materiaNombre }) => {
    // --- ESTADOS DE DATOS ---
    const [fechaExamen, setFechaExamen] = useState(new Date().toISOString().split('T')[0]);
    const [observaciones, setObservaciones] = useState('');
    const [alumnos, setAlumnos] = useState([]);

    // Estado para nuevo alumno
    const [nuevoAlumno, setNuevoAlumno] = useState({
        nombre_completo: '',
        dni: '',
    });

    // --- ESTADOS DE VISTA PREVIA / PDF ---
    const componentRef = useRef(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // --- MANEJADORES ---
    const handleAddAlumno = () => {
        if (!nuevoAlumno.nombre_completo) return;
        setAlumnos([...alumnos, {
            ...nuevoAlumno,
            estado: 'Nivelación',
            nota_escrito: null,
            nota_oral: null,
            promedio: null
        }]);
        setNuevoAlumno({
            nombre_completo: '',
            dni: '',
        });
    };

    const handleRemoveAlumno = (index) => {
        const newAlumnos = [...alumnos];
        newAlumnos.splice(index, 1);
        setAlumnos(newAlumnos);
    };



    // --- IMPRESIÓN / PDF ---
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Planilla_Nivelacion_${materiaNombre || 'SinMateria'}`,
    });

    const handleDownloadPDF = async () => {
        if (!componentRef.current) return;
        setIsGeneratingPdf(true);

        try {
            const original = componentRef.current;
            const clone = original.cloneNode(true);

            Object.assign(clone.style, {
                position: 'fixed',
                top: '-10000px',
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

            document.body.appendChild(clone);

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 794,
                windowHeight: 1123
            });

            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Planilla_Nivelacion_${materiaNombre}.pdf`);

        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Error al generar el PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    // --- PREPARAR DATOS PARA VISTA PREVIA ---
    // --- PREPARAR DATOS PARA VISTA PREVIA ---
    let dia = '', mes = '', anio = '';
    if (fechaExamen) {
        const [y, m, d] = fechaExamen.split('-'); // YYYY-MM-DD
        dia = d;
        mes = m;
        anio = y ? y.slice(-2) : '';
    }

    // Mapear alumnos al formato que espera PlanillaImprimible (nombre, dni, estado)
    const alumnosPreview = alumnos.map(a => ({
        nombre: a.nombre_completo,
        dni: a.dni,
        estado: 'Reg. Nivelación'
    }));

    const datosImpresion = {
        materia: materiaNombre || '...',
        curso: cursoNombre || '...',
        dia,
        mes,
        anio,
        alumnos: alumnosPreview
    };

    return (

        <Card className="shadow-sm border-0">
            <Card.Body>
                <div className="mb-4">
                    <h5 className="m-0 fw-bold" style={{ color: '#303F9F' }}>Nueva Planilla de Nivelación</h5>
                </div>

                <Row>
                    {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
                    <Col lg={5} className="mb-4">
                        <div className="bg-light p-3 rounded border mb-3">
                            <h6 className="fw-bold mb-3" style={{ color: '#303F9F' }}>1. Datos del Examen</h6>
                            <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold">Fecha Examen</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaExamen}
                                    onChange={e => setFechaExamen(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold">Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={observaciones}
                                    onChange={e => setObservaciones(e.target.value)}
                                />
                            </Form.Group>
                        </div>

                        <div className="bg-light p-3 rounded border">
                            <h6 className="fw-bold mb-3" style={{ color: '#303F9F' }}>2. Alumnos a Evaluar</h6>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre Completo:</label>
                                <input
                                    type="text" className="form-control mb-2" placeholder="Ej: Perez, Juan"
                                    value={nuevoAlumno.nombre_completo}
                                    onChange={e => setNuevoAlumno({ ...nuevoAlumno, nombre_completo: e.target.value })}
                                />
                                <div className="d-flex gap-2">
                                    <div className="flex-grow-1">
                                        <input
                                            type="text" className="form-control" placeholder="DNI"
                                            value={nuevoAlumno.dni}
                                            onChange={e => setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })}
                                        />
                                    </div>
                                    <Button variant="success" onClick={handleAddAlumno} className="d-flex align-items-center">
                                        <span className="material-symbols-outlined me-1">add</span>
                                    </Button>
                                </div>
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                                                    <td className="align-middle">{d.nombre_completo}</td>
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


                    </Col>


                    {/* --- COLUMNA DERECHA: VISTA PREVIA --- */}
                    <Col lg={7}>
                        <div style={{ position: 'sticky', top: '20px' }}>
                            {/* BOTONES DE IMPRESIÓN */}
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

                                <div className="d-flex justify-content-center align-items-start" style={{ background: '#525659', padding: '20px', borderRadius: '4px' }}>
                                    <div style={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        padding: '0',
                                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                                        marginBottom: '20px'
                                    }}>
                                        <div ref={componentRef} style={{ width: '100%', minHeight: '297mm', overflow: 'hidden' }}>
                                            <PlanillaImprimible
                                                tipo="NIVELACIÓN" // Tipo específico para que salga en el título
                                                datos={datosImpresion}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PlanillaNivelacionForm;
