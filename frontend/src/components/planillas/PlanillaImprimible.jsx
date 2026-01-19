import logoplanilla from '../../assets/logoguidoplanilla.png';

const PlanillaImprimible = ({ tipo, datos }) => {
    const alumnosParaRender = datos?.alumnos || [];
    const tituloMapa = {
        'REGULAR': 'REGULAR',
        'PREVIA': 'REG-PREVIA',
        'NIVELACION': 'REG-NIVELACION'
    };

    return (
        <div style={{
            padding: '15px 40px', // Aún menos padding vertical
            fontFamily: 'Arial, sans-serif',
            color: 'black',
            backgroundColor: 'white',
            boxShadow: 'none',
            height: '100%', // Intentar ocupar la hoja sin desbordar
            boxSizing: 'border-box'
        }}>
            {/* CABECERA OFICIAL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'center' }}>
                <div style={{ width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

                <div style={{ textAlign: 'center', flex: 1, padding: '0 5px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>INSTITUTO CARLOS GUIDO SPANO F-33</h2>
                    <p style={{ margin: 0, fontSize: '12px' }}>R.M. 910/5</p>
                    <h3 style={{ marginTop: '5px', fontSize: '16px', textDecoration: 'underline', fontWeight: 'bold' }}>
                        ACTA VOLANTE DE EXÁMEN: {tituloMapa[tipo] || tipo}
                    </h3>
                </div>

                <div style={{ width: '120px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black', fontSize: '10px', textAlign: 'center' }}>
                        <thead>
                            <tr><th colSpan="3" style={{ borderBottom: '1px solid black', padding: '1px' }}>FECHA</th></tr>
                        </thead>
                        <tbody>
                            <tr style={{ fontSize: '10px' }}>
                                <td style={{ borderRight: '1px solid black', width: '33%' }}>D</td>
                                <td style={{ borderRight: '1px solid black', width: '33%' }}>M</td>
                                <td>A</td>
                            </tr>
                            <tr style={{ height: '25px', fontSize: '14px', fontWeight: 'bold' }}>
                                <td style={{ borderRight: '1px solid black' }}>{datos?.dia}</td>
                                <td style={{ borderRight: '1px solid black' }}>{datos?.mes}</td>
                                <td>{datos?.anio}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DATOS DE LA MATERIA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', borderBottom: '2px solid black', paddingBottom: '3px' }}>
                <span style={{ fontSize: '13px' }}>Asignatura: <strong>{datos?.materia}</strong></span>
                <span style={{ fontSize: '13px' }}>Curso: <strong>{datos?.curso}</strong></span>
            </div>

            {/* TABLA DE CALIFICACIONES */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', fontSize: '11px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{ border: '1px solid black', padding: '3px', width: '30px' }}>Nº</th>
                        <th style={{ border: '1px solid black', padding: '3px' }}>APELLIDO Y NOMBRE</th>
                        <th style={{ border: '1px solid black', width: '45px' }}>ESC.</th>
                        <th style={{ border: '1px solid black', width: '45px' }}>ORAL</th>
                        <th style={{ border: '1px solid black', width: '45px' }}>PROM.</th>
                        <th style={{ border: '1px solid black', width: '90px' }}>DNI</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(25)].map((_, index) => {
                        const alumno = alumnosParaRender[index];
                        return (
                            <tr key={index} style={{ height: '24px' }}>
                                <td style={{ border: '1px solid black', textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
                                <td style={{ border: '1px solid black', paddingLeft: '5px' }}>{alumno?.nombre || ''}</td>
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