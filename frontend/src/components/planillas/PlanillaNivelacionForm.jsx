import React, { useState } from 'react';
import { Form, Button, Table, Row, Col } from 'react-bootstrap';
import { crearPlanillaNivelacion } from '../../services/planillasService';
import Swal from 'sweetalert2';

const PlanillaNivelacionForm = ({ filtros, onSuccess }) => {
    const [fechaExamen, setFechaExamen] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [folio, setFolio] = useState('');
    const [libro, setLibro] = useState('');

    // Lista de alumnos manuales
    const [alumnos, setAlumnos] = useState([]);

    // Estado para nuevo alumno
    const [nuevoAlumno, setNuevoAlumno] = useState({
        nombre_completo: '',
        dni: '',
        nota_escrito: '',
        nota_oral: '',
        promedio: ''
    });

    const handleAddAlumno = () => {
        if (!nuevoAlumno.nombre_completo) return;
        setAlumnos([...alumnos, nuevoAlumno]);
        setNuevoAlumno({
            nombre_completo: '',
            dni: '',
            nota_escrito: '',
            nota_oral: '',
            promedio: ''
        });
    };

    const handleguardar = async () => {
        if (!fechaExamen || alumnos.length === 0) {
            Swal.fire('Error', 'Debe ingresar fecha y al menos un alumno', 'error');
            return;
        }

        try {
            const payload = {
                fecha_examen: fechaExamen,
                id_materia: filtros.materia,
                id_curso: filtros.curso,
                anio_lectivo: filtros.anioLectivo,
                observaciones,
                folio,
                libro,
                detalles: alumnos
            };

            await crearPlanillaNivelacion(payload);
            Swal.fire('Éxito', 'Planilla de Nivelación creada', 'success');
            if (onSuccess) onSuccess();

            // Reset form
            setAlumnos([]);
            setFechaExamen('');
            setObservaciones('');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar la planilla', 'error');
        }
    };

    return (
        <div className="p-3 border rounded bg-white">
            <h4>Nueva Planilla de Nivelación</h4>

            <Row className="mb-3">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Fecha Examen</Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaExamen}
                            onChange={e => setFechaExamen(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Folio</Form.Label>
                        <Form.Control type="text" value={folio} onChange={e => setFolio(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Libro</Form.Label>
                        <Form.Control type="text" value={libro} onChange={e => setLibro(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={2}
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                />
            </Form.Group>

            <hr />

            <h5>Agregar Alumnos (Manual)</h5>
            <Row className="mb-2 align-items-end">
                <Col md={3}>
                    <Form.Control
                        placeholder="Nombre Completo"
                        value={nuevoAlumno.nombre_completo}
                        onChange={e => setNuevoAlumno({ ...nuevoAlumno, nombre_completo: e.target.value })}
                    />
                </Col>
                <Col md={2}>
                    <Form.Control
                        placeholder="DNI"
                        value={nuevoAlumno.dni}
                        onChange={e => setNuevoAlumno({ ...nuevoAlumno, dni: e.target.value })}
                    />
                </Col>
                {/* Notas opcionales */}
                <Col md={3}>
                    <Button variant="secondary" onClick={handleAddAlumno}>Agregar a lista</Button>
                </Col>
            </Row>

            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map((alu, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{alu.nombre_completo}</td>
                            <td>{alu.dni}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => setAlumnos(alumnos.filter((_, i) => i !== idx))}>X</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="mt-3 text-end">
                <Button variant="success" onClick={handleguardar}>Guardar Planilla</Button>
            </div>
        </div>
    );
};

export default PlanillaNivelacionForm;
