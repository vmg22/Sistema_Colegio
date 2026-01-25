import logoplanilla from '../../assets/logoguidoplanilla.png';

const PlanillaImprimible = ({ tipo, datos }) => {
    const alumnosParaRender = datos?.alumnos || [];
    const tituloMapa = {
        'REGULAR': 'REGULAR',
        'PREVIA': 'REG-PREVIA',
        'NIVELACION': 'REG-NIVELACION'
    };

    return (
        <div className="planilla-container" style={{
            padding: '15px 40px',
            fontFamily: 'Arial, sans-serif',
            color: 'black',
            backgroundColor: 'white',
            boxShadow: 'none',
            height: '100%',
            boxSizing: 'border-box',
            width: '100%'
        }}>
            <style>
                {`
                    @media print {
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            -webkit-print-color-adjust: exact;
                        }
                        .planilla-container {
                            width: 210mm !important;
                            height: 297mm !important;
                            padding: 15px 40px !important;
                        }
                    }
                `}
            </style>
            {/* CABECERA OFICIAL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'flex-start' }}>
                <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={logoplanilla}
                        alt="Logo CGS"
                        style={{
                            width: '100%',
                            height: 'auto',
                            mixBlendMode: 'multiply',
                            filter: 'contrast(1.2)'
                        }}
                    />
                </div>

                <div style={{ textAlign: 'center', flex: 1, padding: '0 5px', paddingTop: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>INSTITUTO CARLOS GUIDO SPANO F-33</h2>
                    <p style={{ margin: 0, fontSize: '12px' }}>R.M. 910/5</p>
                </div>

                <div style={{ width: '140px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
                        ACTAS VOLANTES<br />DE EXÁMENES
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '10px', textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th style={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}>DIA</th>
                                <th style={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}>MES</th>
                                <th style={{ borderBottom: '1px solid black' }}>AÑO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ height: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                                <td style={{ borderRight: '1px solid black' }}>{datos?.dia}</td>
                                <td style={{ borderRight: '1px solid black' }}>{datos?.mes}</td>
                                <td>{datos?.anio}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DATOS DE LA MATERIA Y EXAMEN */}
            <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', marginBottom: '2px' }}>
                    Exámenes de Alumnos: <strong>{tituloMapa[tipo] || tipo}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '13px' }}>Asignatura: <strong>{datos?.materia}</strong></span>
                    <span style={{ fontSize: '13px' }}>Curso: <strong>{datos?.curso}</strong></span>
                </div>
            </div>

            {/* TABLA DE CALIFICACIONES */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '11px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', height: '25px' }}>
                        <th rowSpan="2" style={{ border: '1px solid black', padding: '3px', width: '25px' }}></th>
                        <th rowSpan="2" style={{ border: '1px solid black', padding: '3px' }}>APELLIDO Y NOMBRE</th>
                        <th colSpan="3" style={{ border: '1px solid black', textAlign: 'center' }}>Clasificaciones</th>
                        <th style={{ border: '1px solid black', width: '60px', textAlign: 'center', fontSize: '10px' }}>Nº de<br />Bolilla</th>
                        <th rowSpan="2" style={{ border: '1px solid black', width: '90px', textAlign: 'center' }}>DOCUMENTO<br />DE<br />IDENTIDAD</th>
                    </tr>
                    <tr style={{ backgroundColor: '#f0f0f0', height: '25px' }}>
                        <th style={{ border: '1px solid black', width: '35px', textAlign: 'center' }}>Esc.</th>
                        <th style={{ border: '1px solid black', width: '35px', textAlign: 'center' }}>Oral</th>
                        <th style={{ border: '1px solid black', width: '35px', textAlign: 'center' }}>Prom</th>
                        <th style={{ border: '1px solid black', textAlign: 'center', fontSize: '9px' }}>Esc-Oral</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(25)].map((_, index) => {
                        const alumno = alumnosParaRender[index];
                        return (
                            <tr key={index} style={{ height: '22px' }}>
                                <td style={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
                                <td style={{ border: '1px solid black', paddingLeft: '5px' }}>{alumno?.nombre || ''}</td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black' }}></td>
                                <td style={{ border: '1px solid black', textAlign: 'center' }}>{alumno?.dni || ''}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* FIRMAS */}
            {/* FIRMAS Y PIE */}
            <div style={{ marginTop: '15px' }}>
                <h4 style={{ textAlign: 'left', textDecoration: 'underline', fontSize: '13px', marginBottom: '15px', marginLeft: '10px' }}>TRIBUNAL EXAMINADOR</h4>

                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px', marginBottom: '15px' }}>
                    <div style={{ textAlign: 'center' }}>_______________________<br /><strong style={{ fontSize: '10px' }}>Presidente</strong></div>
                    <div style={{ textAlign: 'center' }}>_______________________<br /><strong style={{ fontSize: '10px' }}>Vocal 1</strong></div>
                    <div style={{ textAlign: 'center' }}>_______________________<br /><strong style={{ fontSize: '10px' }}>Vocal 2</strong></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                    <div style={{ paddingLeft: '10px' }}>
                        San Miguel de Tucumán,
                    </div>

                    <div style={{ fontSize: '11px', minWidth: '180px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                            <strong>TOTAL DE ALUMNOS:</strong> <span style={{ borderBottom: '1px solid black', width: '35px' }}></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                            <strong>APROBADOS:</strong> <span style={{ borderBottom: '1px solid black', width: '35px' }}></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1px' }}>
                            <strong>APLAZADOS:</strong> <span style={{ borderBottom: '1px solid black', width: '35px' }}></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>AUSENTES:</strong> <span style={{ borderBottom: '1px solid black', width: '35px' }}></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanillaImprimible;