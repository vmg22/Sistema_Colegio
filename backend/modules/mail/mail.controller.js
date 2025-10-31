const { 
  enviarMailTest,
  enviarRecuperacionPassword,
  enviarAlertaAsistencia,
  enviarNotificacionReunion,
  enviarNotificacionGeneral,
  obtenerDatosAlumno,
  enviarAlertaAsistenciaMasiva,
  enviarNotificacionReunionMasiva,
  enviarNotificacionGeneralMasiva,

  //Por curso
  obtenerCursosDisponibles,
  obtenerAlumnosPorCurso,
  enviarAlertaAsistenciaPorCurso,
  enviarNotificacionReunionPorCurso,
  enviarNotificacionGeneralPorCurso,
  enviarNotificacionGeneralPorCursosMultiples
} = require('../../services/emails.service');

const TestMail = async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ success: false, message: 'El campo "to" es requerido' });
    }
    const info = await enviarMailTest(to);
    return res.status(200).json({
      success: true,
      message: 'Email de prueba enviado correctamente',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar email',
      error: error.message
    });
  }
};

const EnviarRecuperacion = async (req, res) => {
  try {
    const { email, link } = req.body;
    if (!email || !link) {
      return res.status(400).json({ success: false, message: 'Los campos "email" y "link" son requeridos' });
    }
    const info = await enviarRecuperacionPassword(email, link);
    return res.status(200).json({
      success: true,
      message: 'Email de recuperación enviado correctamente',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error al enviar email de recuperación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar email de recuperación',
      error: error.message
    });
  }
};

const EnviarAlertaAsistencia = async (req, res) => {
  try {
    const { dni, anio, faltasMaximas } = req.body;
    if (!dni) return res.status(400).json({ success: false, message: 'El campo "dni" es requerido' });
    if (!anio) return res.status(400).json({ success: false, message: 'El campo "anio" es requerido' });
    const resultado = await enviarAlertaAsistencia(dni, anio, faltasMaximas);
    return res.status(200).json({ success: true, ...resultado });
  } catch (error) {
    console.error('Error al enviar alerta de asistencia:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar alerta de asistencia', error: error.message });
  }
};

const EnviarNotificacionReunion = async (req, res) => {
  try {
    const { dni, anio, reunionData } = req.body;
    if (!dni) return res.status(400).json({ success: false, message: 'El campo "dni" es requerido' });
    if (!anio) return res.status(400).json({ success: false, message: 'El campo "anio" es requerido' });
    if (!reunionData) return res.status(400).json({ success: false, message: 'El campo "reunionData" es requerido' });

    const camposRequeridos = ['motivo', 'fecha', 'hora'];
    const camposFaltantes = camposRequeridos.filter(campo => !reunionData[campo]);
    if (camposFaltantes.length > 0)
      return res.status(400).json({ success: false, message: `Campos requeridos: ${camposFaltantes.join(', ')}` });

    const resultado = await enviarNotificacionReunion(dni, anio, reunionData);
    return res.status(200).json({ success: true, ...resultado });
  } catch (error) {
    console.error('Error al enviar notificación de reunión:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar notificación de reunión', error: error.message });
  }
};

const EnviarNotificacionGeneral = async (req, res) => {
  try {
    const { dni, anio, notificacionData } = req.body;
    if (!dni) return res.status(400).json({ success: false, message: 'El campo "dni" es requerido' });
    if (!anio) return res.status(400).json({ success: false, message: 'El campo "anio" es requerido' });
    if (!notificacionData) return res.status(400).json({ success: false, message: 'El campo "notificacionData" es requerido' });

    const camposRequeridos = ['asunto', 'mensaje'];
    const camposFaltantes = camposRequeridos.filter(campo => !notificacionData[campo]);
    if (camposFaltantes.length > 0)
      return res.status(400).json({ success: false, message: `Campos requeridos: ${camposFaltantes.join(', ')}` });

    if (!notificacionData.tipo) notificacionData.tipo = 'informacion';

    const resultado = await enviarNotificacionGeneral(dni, anio, notificacionData);
    return res.status(200).json({ success: true, ...resultado });
  } catch (error) {
    console.error('Error al enviar notificación general:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar notificación general', error: error.message });
  }
};

const ObtenerDatosAlumno = async (req, res) => {
  try {
    const { dni, anio } = req.params;
    if (!dni || !anio)
      return res.status(400).json({ success: false, message: 'Los parámetros "dni" y "anio" son requeridos' });

    const alumnoData = await obtenerDatosAlumno(dni, anio);
    return res.status(200).json({ success: true, message: 'Datos del alumno obtenidos correctamente', data: alumnoData });
  } catch (error) {
    console.error('Error al obtener datos del alumno:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener datos del alumno', error: error.message });
  }
};

// ========================================
// CONTROLLERS PARA ENVÍO MASIVO
// ========================================

const EnviarAlertaAsistenciaMasiva = async (req, res) => {
  try {
    const { dnis, anio, faltasMaximas } = req.body;
    if (!dnis || !Array.isArray(dnis) || dnis.length === 0)
      return res.status(400).json({ success: false, message: 'El campo "dnis" debe ser un array con al menos un DNI' });
    if (!anio)
      return res.status(400).json({ success: false, message: 'El campo "anio" es requerido' });

    const resultado = await enviarAlertaAsistenciaMasiva(dnis, anio, faltasMaximas);
    return res.status(200).json({ success: true, message: `Envío masivo completado`, ...resultado });
  } catch (error) {
    console.error('❌ Error al enviar alerta masiva:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar alerta masiva', error: error.message });
  }
};

const EnviarNotificacionReunionMasiva = async (req, res) => {
  try {
    const { dnis, anio, reunionData } = req.body;
    if (!dnis || !Array.isArray(dnis) || dnis.length === 0)
      return res.status(400).json({ success: false, message: 'El campo "dnis" debe ser un array con al menos un DNI' });
    if (!anio)
      return res.status(400).json({ success: false, message: 'El campo "anio" es requerido' });
    if (!reunionData)
      return res.status(400).json({ success: false, message: 'El campo "reunionData" es requerido' });

    const camposRequeridos = ['motivo', 'fecha', 'hora'];
    const camposFaltantes = camposRequeridos.filter(campo => !reunionData[campo]);
    if (camposFaltantes.length > 0)
      return res.status(400).json({ success: false, message: `Campos requeridos: ${camposFaltantes.join(', ')}` });

    const resultado = await enviarNotificacionReunionMasiva(dnis, anio, reunionData);
    return res.status(200).json({ success: true, message: 'Envío masivo completado', ...resultado });
  } catch (error) {
    console.error('❌ Error al enviar notificación masiva:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar notificación masiva', error: error.message });
  }
};

const EnviarNotificacionGeneralMasiva = async (req, res) => {
  try {
    const { dnis, anio, notificacionData } = req.body;
    if (!dnis || !Array.isArray(dnis) || dnis.length === 0)
      return res.status(400).json({ success: false, message: 'El campo "dnis" debe ser un array con al menos un DNI' });
    if (!anio)
      return res.status(400).json({ success: false, message: 'El campo "anio" es requerido' });
    if (!notificacionData)
      return res.status(400).json({ success: false, message: 'El campo "notificacionData" es requerido' });

    const camposRequeridos = ['asunto', 'mensaje'];
    const camposFaltantes = camposRequeridos.filter(campo => !notificacionData[campo]);
    if (camposFaltantes.length > 0)
      return res.status(400).json({ success: false, message: `Campos requeridos: ${camposFaltantes.join(', ')}` });

    if (!notificacionData.tipo) notificacionData.tipo = 'informacion';

    const resultado = await enviarNotificacionGeneralMasiva(dnis, anio, notificacionData);
    return res.status(200).json({ success: true, message: 'Envío masivo completado', ...resultado });
  } catch (error) {
    console.error('❌ Error al enviar notificación masiva:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar notificación masiva', error: error.message });
  }
};

const ObtenerCursosDisponibles = async (req, res) => {
    try {
        const { anio } = req.params;
        
        if (!anio) {
            return res.status(400).json({ 
                success: false,
                message: 'El parámetro "anio" es requerido' 
            });
        }

        const cursos = await obtenerCursosDisponibles(anio);
        
        return res.status(200).json({
            success: true,
            message: 'Cursos obtenidos correctamente',
            data: cursos
        });
    } catch (error) {
        console.error('❌ Error al obtener cursos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener cursos',
            error: error.message
        });
    }
};

// Obtener alumnos de un curso (MODIFICADO)
const ObtenerAlumnosPorCurso = async (req, res) => {
    try {
        const { anio_curso, division, anio_lectivo } = req.params;
        
        if (!anio_curso || !division || !anio_lectivo) {
            return res.status(400).json({ 
                success: false,
                message: 'Los parámetros "anio_curso", "division" y "anio_lectivo" son requeridos' 
            });
        }

        const alumnos = await obtenerAlumnosPorCurso(anio_curso, division, anio_lectivo);
        
        return res.status(200).json({
            success: true,
            message: 'Alumnos obtenidos correctamente',
            data: alumnos,
            total: alumnos.length
        });
    } catch (error) {
        console.error('❌ Error al obtener alumnos del curso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener alumnos del curso',
            error: error.message
        });
    }
};

// Enviar alerta de asistencia a un curso completo (MODIFICADO)
const EnviarAlertaAsistenciaPorCurso = async (req, res) => {
    try {
        const { anio_curso, division, anio_lectivo, faltasMaximas } = req.body;
        
        console.log('📥 Request alerta por curso:', { anio_curso, division, anio_lectivo, faltasMaximas });
        
        if (!anio_curso) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "anio_curso" es requerido' 
            });
        }
        if (!division) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "division" es requerido' 
            });
        }
        if (!anio_lectivo) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "anio_lectivo" es requerido' 
            });
        }

        const resultado = await enviarAlertaAsistenciaPorCurso(anio_curso, division, anio_lectivo, faltasMaximas);
        
        return res.status(200).json({
            success: true,
            message: `Emails enviados al curso: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
            ...resultado
        });
    } catch (error) {
        console.error('❌ Error al enviar alerta por curso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al enviar alerta por curso',
            error: error.message
        });
    }
};

// Enviar notificación de reunión a un curso completo (MODIFICADO)
const EnviarNotificacionReunionPorCurso = async (req, res) => {
    try {
        const { anio_curso, division, anio_lectivo, reunionData } = req.body;
        
        console.log('📥 Request reunión por curso:', { anio_curso, division, anio_lectivo });
        
        if (!anio_curso) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "anio_curso" es requerido' 
            });
        }
        if (!division) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "division" es requerido' 
            });
        }
        if (!anio_lectivo) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "anio_lectivo" es requerido' 
            });
        }

        if (!reunionData) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "reunionData" es requerido' 
            });
        }

        const camposRequeridos = ['motivo', 'fecha', 'hora'];
        const camposFaltantes = camposRequeridos.filter(campo => !reunionData[campo]);
        
        if (camposFaltantes.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: `Campos requeridos en reunionData: ${camposFaltantes.join(', ')}` 
            });
        }

        const resultado = await enviarNotificacionReunionPorCurso(anio_curso, division, anio_lectivo, reunionData);
        
        return res.status(200).json({
            success: true,
            message: `Emails enviados al curso: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
            ...resultado
        });
    } catch (error) {
        console.error('❌ Error al enviar reunión por curso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al enviar reunión por curso',
            error: error.message
        });
    }
};

// Enviar notificación general a un curso completo (MODIFICADO)
const EnviarNotificacionGeneralPorCurso = async (req, res) => {
    try {
        const { anio_curso, division, anio_lectivo, notificacionData } = req.body;
        
        console.log('📥 Request notificación por curso:', { anio_curso, division, anio_lectivo });
        
        if (!anio_curso) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "anio_curso" es requerido' 
            });
        }
        if (!division) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "division" es requerido' 
            });
        }
        if (!anio_lectivo) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "anio_lectivo" es requerido' 
            });
        }

        if (!notificacionData) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "notificacionData" es requerido' 
            });
        }

        const camposRequeridos = ['asunto', 'mensaje'];
        const camposFaltantes = camposRequeridos.filter(campo => !notificacionData[campo]);
        
        if (camposFaltantes.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: `Campos requeridos en notificacionData: ${camposFaltantes.join(', ')}` 
            });
        }

        if (!notificacionData.tipo) {
            notificacionData.tipo = 'informacion';
        }

        const resultado = await enviarNotificacionGeneralPorCurso(anio_curso, division, anio_lectivo, notificacionData);
        
        return res.status(200).json({
            success: true,
            message: `Emails enviados al curso: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
            ...resultado
        });
    } catch (error) {
        console.error('❌ Error al enviar notificación por curso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al enviar notificación por curso',
            error: error.message
        });
    }
};

// Enviar notificación a múltiples cursos (MODIFICADO - Opcion 1 aplicada)
const EnviarNotificacionGeneralPorCursosMultiples = async (req, res) => {
    try {
        // SOLO se desestructura 'cursos' y 'notificacionData'
        const { cursos, notificacionData } = req.body; 
        
        console.log('📥 Request notificación a múltiples cursos:', { 
            cantidad: cursos?.length, 
        });
        
        if (!cursos || !Array.isArray(cursos) || cursos.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "cursos" debe ser un array con al menos un curso { anio_curso, division, anio_lectivo }' 
            });
        }

        // SE ELIMINA LA VALIDACIÓN de anio_lectivo_base

        if (!notificacionData) {
            return res.status(400).json({ 
                success: false,
                message: 'El campo "notificacionData" es requerido' 
            });
        }

        const camposRequeridos = ['asunto', 'mensaje'];
        const camposFaltantes = camposRequeridos.filter(campo => !notificacionData[campo]);
        
        if (camposFaltantes.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: `Campos requeridos en notificacionData: ${camposFaltantes.join(', ')}` 
            });
        }

        if (!notificacionData.tipo) {
            notificacionData.tipo = 'informacion';
        }

        // Llamada al servicio
        const resultado = await enviarNotificacionGeneralPorCursosMultiples(cursos, notificacionData);
        
        return res.status(200).json({
            success: true,
            message: `Emails enviados a ${resultado.totalCursos} cursos: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
            ...resultado
        });
    } catch (error) {
        console.error('❌ Error al enviar notificación a múltiples cursos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al enviar notificación a múltiples cursos',
            error: error.message
        });
    }
};

module.exports = {
    // Existentes...
    TestMail,
    EnviarRecuperacion,
    EnviarAlertaAsistencia,
    EnviarNotificacionReunion,
    EnviarNotificacionGeneral,
    ObtenerDatosAlumno,
    EnviarAlertaAsistenciaMasiva,
    EnviarNotificacionReunionMasiva,
    EnviarNotificacionGeneralMasiva,
    // Nuevos controllers por curso
    ObtenerCursosDisponibles,
    ObtenerAlumnosPorCurso,
    EnviarAlertaAsistenciaPorCurso,
    EnviarNotificacionReunionPorCurso,
    EnviarNotificacionGeneralPorCurso,
    EnviarNotificacionGeneralPorCursosMultiples
};