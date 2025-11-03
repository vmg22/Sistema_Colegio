const {
  enviarMailTest,
  enviarRecuperacionPassword ,
  enviarAlertaAsistencia,
  enviarNotificacionReunion,
  enviarNotificacionGeneral,
  obtenerDatosAlumno,
  enviarAlertaAsistenciaMasiva,
  enviarNotificacionReunionMasiva,
  enviarNotificacionGeneralMasiva, //Por curso

  obtenerCursosDisponibles,
  obtenerAlumnosPorCurso, // Este servicio ahora recibe idCurso y anio para la ruta GET
  enviarAlertaAsistenciaPorCurso,
  enviarNotificacionReunionPorCurso,
  enviarNotificacionGeneralPorCurso,
  enviarNotificacionGeneralPorCursosMultiples,
} = require("../../services/emails.service");

// Función auxiliar para obtener el ID de usuario de forma segura
const getUserId = (req) => {
  // Intenta obtenerlo de req.body o usa 1 por defecto.
  // En una aplicación real, se usaría req.user.id (desde el middleware de auth).
  return req.body.id_usuario || 1;
};

// ========================================
// CONTROLLERS INDIVIDUALES (Añadido id_usuario)
// ========================================

const TestMail = async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res
        .status(400)
        .json({ success: false, message: 'El campo "to" es requerido' });
    }
    const info = await enviarMailTest(to);
    return res.status(200).json({
      success: true,
      message: "Email de prueba enviado correctamente",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar email",
      error: error.message,
    });
  }
};

//* Enviar email de recuperación de contraseña
//* @param {string} email - Email del destinatario
//* @param {string} resetLink - Link de recuperación con token
//* @param {string} username - Nombre del usuario
// */
// const enviarRecuperacionPassword  = async (email, resetLink, username) => {
//   try {
//     const mailOptions = {
//       from: `"Sistema Colegio Carlos Guido Spano" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Recuperación de Contraseña - Sistema de Gestión",
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               line-height: 1.6;
//               color: #333;
//               max-width: 600px;
//               margin: 0 auto;
//               padding: 20px;
//             }
//             .header {
//               background-color: #5b68df;
//               color: white;
//               padding: 20px;
//               text-align: center;
//               border-radius: 8px 8px 0 0;
//             }
//             .content {
//               background-color: #f9f9f9;
//               padding: 30px;
//               border: 1px solid #ddd;
//               border-top: none;
//               border-radius: 0 0 8px 8px;
//             }
//             .button {
//               display: inline-block;
//               padding: 12px 30px;
//               background-color: #5b68df;
//               color: white;
//               text-decoration: none;
//               border-radius: 5px;
//               margin: 20px 0;
//               font-weight: bold;
//             }
//             .button:hover {
//               background-color: #4a56c4;
//             }
//             .footer {
//               margin-top: 20px;
//               padding-top: 20px;
//               border-top: 1px solid #ddd;
//               font-size: 12px;
//               color: #666;
//               text-align: center;
//             }
//             .warning {
//               background-color: #fff3cd;
//               border-left: 4px solid #ffc107;
//               padding: 12px;
//               margin: 15px 0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Recuperación de Contraseña</h1>
//           </div>
//           <div class="content">
//             <h2>Hola, ${username || "Usuario"}!</h2>
//             <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el Sistema de Gestión del Colegio Carlos Guido Spano.</p>
            
//             <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            
//             <div style="text-align: center;">
//               <a href="${resetLink}" class="button">RESTABLECER CONTRASEÑA</a>
//             </div>
            
//             <p>O copia y pega este enlace en tu navegador:</p>
//             <p style="word-break: break-all; background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
//               ${resetLink}
//             </p>
            
//             <div class="warning">
//               <strong>⚠️ Importante:</strong>
//               <ul style="margin: 10px 0;">
//                 <li>Este enlace es válido por <strong>1 hora</strong></li>
//                 <li>Si no solicitaste este cambio, ignora este correo</li>
//                 <li>Tu contraseña actual seguirá siendo válida hasta que la cambies</li>
//               </ul>
//             </div>
//           </div>
//           <div class="footer">
//             <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
//             <p>&copy; ${new Date().getFullYear()} Colegio Carlos Guido Spano - Sistema de Gestión</p>
//           </div>
//         </body>
//         </html>
//       `,
//       // Versión texto plano como alternativa
//       text: `
//         Recuperación de Contraseña
        
//         Hola, ${username || "Usuario"}!
        
//         Hemos recibido una solicitud para restablecer tu contraseña.
        
//         Haz clic en el siguiente enlace para crear una nueva contraseña:
//         ${resetLink}
        
//         Este enlace es válido por 1 hora.
        
//         Si no solicitaste este cambio, ignora este correo.
        
//         Colegio Carlos Guido Spano - Sistema de Gestión
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email enviado:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error al enviar email:", error);
//     throw new Error("No se pudo enviar el correo de recuperación");
//   }
// };

const EnviarAlertaAsistencia = async (req, res) => {
  try {
    const { dni, anio, faltasMaximas } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario
    if (!dni)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "dni" es requerido' });
    if (!anio)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "anio" es requerido' });
    const resultado = await enviarAlertaAsistencia(
      dni,
      anio,
      faltasMaximas,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({ success: true, ...resultado });
  } catch (error) {
    console.error("Error al enviar alerta de asistencia:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar alerta de asistencia",
        error: error.message,
      });
  }
};

const EnviarNotificacionReunion = async (req, res) => {
  try {
    const { dni, anio, reunionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario

    if (!dni)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "dni" es requerido' });
    if (!anio)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "anio" es requerido' });
    if (!reunionData)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "reunionData" es requerido',
        });

    const camposRequeridos = ["motivo", "fecha", "hora"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !reunionData[campo]
    );
    if (camposFaltantes.length > 0)
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos: ${camposFaltantes.join(", ")}`,
        });

    const resultado = await enviarNotificacionReunion(
      dni,
      anio,
      reunionData,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({ success: true, ...resultado });
  } catch (error) {
    console.error("Error al enviar notificación de reunión:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar notificación de reunión",
        error: error.message,
      });
  }
};

const EnviarNotificacionGeneral = async (req, res) => {
  try {
    const { dni, anio, notificacionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario

    if (!dni)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "dni" es requerido' });
    if (!anio)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "anio" es requerido' });
    if (!notificacionData)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "notificacionData" es requerido',
        });

    const camposRequeridos = ["asunto", "mensaje"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !notificacionData[campo]
    );
    if (camposFaltantes.length > 0)
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos: ${camposFaltantes.join(", ")}`,
        });

    if (!notificacionData.tipo) notificacionData.tipo = "informacion";

    const resultado = await enviarNotificacionGeneral(
      dni,
      anio,
      notificacionData,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({ success: true, ...resultado });
  } catch (error) {
    console.error("Error al enviar notificación general:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar notificación general",
        error: error.message,
      });
  }
};

const ObtenerDatosAlumno = async (req, res) => {
  try {
    const { dni, anio } = req.params;
    if (!dni || !anio)
      return res
        .status(400)
        .json({
          success: false,
          message: 'Los parámetros "dni" y "anio" son requeridos',
        });

    const alumnoData = await obtenerDatosAlumno(dni, anio);
    return res
      .status(200)
      .json({
        success: true,
        message: "Datos del alumno obtenidos correctamente",
        data: alumnoData,
      });
  } catch (error) {
    console.error("Error al obtener datos del alumno:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener datos del alumno",
        error: error.message,
      });
  }
};

// ========================================
// CONTROLLERS PARA ENVÍO MASIVO (Añadido id_usuario)
// ========================================

const EnviarAlertaAsistenciaMasiva = async (req, res) => {
  try {
    const { dnis, anio, faltasMaximas } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario

    if (!dnis || !Array.isArray(dnis) || dnis.length === 0)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "dnis" debe ser un array con al menos un DNI',
        });
    if (!anio)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "anio" es requerido' });

    const resultado = await enviarAlertaAsistenciaMasiva(
      dnis,
      anio,
      faltasMaximas,
      id_usuario
    ); // Pasar ID
    return res
      .status(200)
      .json({
        success: true,
        message: `Envío masivo completado`,
        ...resultado,
      });
  } catch (error) {
    console.error("❌ Error al enviar alerta masiva:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar alerta masiva",
        error: error.message,
      });
  }
};

const EnviarNotificacionReunionMasiva = async (req, res) => {
  try {
    const { dnis, anio, reunionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario

    if (!dnis || !Array.isArray(dnis) || dnis.length === 0)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "dnis" debe ser un array con al menos un DNI',
        });
    if (!anio)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "anio" es requerido' });
    if (!reunionData)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "reunionData" es requerido',
        });

    const camposRequeridos = ["motivo", "fecha", "hora"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !reunionData[campo]
    );
    if (camposFaltantes.length > 0)
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos: ${camposFaltantes.join(", ")}`,
        });

    const resultado = await enviarNotificacionReunionMasiva(
      dnis,
      anio,
      reunionData,
      id_usuario
    ); // Pasar ID
    return res
      .status(200)
      .json({
        success: true,
        message: "Envío masivo completado",
        ...resultado,
      });
  } catch (error) {
    console.error("❌ Error al enviar notificación masiva:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar notificación masiva",
        error: error.message,
      });
  }
};

const EnviarNotificacionGeneralMasiva = async (req, res) => {
  try {
    const { dnis, anio, notificacionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario

    if (!dnis || !Array.isArray(dnis) || dnis.length === 0)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "dnis" debe ser un array con al menos un DNI',
        });
    if (!anio)
      return res
        .status(400)
        .json({ success: false, message: 'El campo "anio" es requerido' });
    if (!notificacionData)
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "notificacionData" es requerido',
        });

    const camposRequeridos = ["asunto", "mensaje"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !notificacionData[campo]
    );
    if (camposFaltantes.length > 0)
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos: ${camposFaltantes.join(", ")}`,
        });

    if (!notificacionData.tipo) notificacionData.tipo = "informacion";

    const resultado = await enviarNotificacionGeneralMasiva(
      dnis,
      anio,
      notificacionData,
      id_usuario
    ); // Pasar ID
    return res
      .status(200)
      .json({
        success: true,
        message: "Envío masivo completado",
        ...resultado,
      });
  } catch (error) {
    console.error("❌ Error al enviar notificación masiva:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error al enviar notificación masiva",
        error: error.message,
      });
  }
};

const ObtenerCursosDisponibles = async (req, res) => {
  try {
    const { anio } = req.params;
    if (!anio) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "anio" es requerido',
      });
    }

    const cursos = await obtenerCursosDisponibles(anio);
    return res.status(200).json({
      success: true,
      message: "Cursos obtenidos correctamente",
      data: cursos,
    });
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener cursos",
      error: error.message,
    });
  }
}; // LLAMADA AL SERVICIO: Usa ID del curso y Año Lectivo

const ObtenerAlumnosPorCurso = async (req, res) => {
  try {
    // CLAVE: Leer los tres parámetros de la URL
    const { anio_curso, division, anio_lectivo } = req.params;

    // Conversión a numérico, manteniendo 'division' como string
    const anioCursoNum = parseInt(anio_curso);
    const anioLectivoNum = parseInt(anio_lectivo);
    if (!anioCursoNum || !division || !anioLectivoNum) {
      return res.status(400).json({
        success: false,
        message:
          'Los parámetros "anio_curso", "division" y "anio_lectivo" son requeridos.',
      });
    } // LLAMADA AL SERVICIO: Usando los 3 parámetros para identificar el curso

    const alumnos = await obtenerAlumnosPorCurso(
      anioCursoNum,
      division,
      anioLectivoNum
    );
    return res.status(200).json({
      success: true,
      message: "Alumnos obtenidos correctamente",
      data: alumnos,
      total: alumnos.length,
    });
  } catch (error) {
    console.error("❌ Error al obtener alumnos del curso:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener alumnos del curso",
      error: error.message,
    });
  }
};

// Enviar alerta de asistencia a un curso completo (MODIFICADO)
const EnviarAlertaAsistenciaPorCurso = async (req, res) => {
  try {
    const { anio_curso, division, anio_lectivo, faltasMaximas } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario

    console.log("📥 Request alerta por curso:", {
      anio_curso,
      division,
      anio_lectivo,
      faltasMaximas,
    });
    if (!anio_curso) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "anio_curso" es requerido',
        });
    }
    if (!division) {
      return res
        .status(400)
        .json({ success: false, message: 'El campo "division" es requerido' });
    }
    if (!anio_lectivo) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "anio_lectivo" es requerido',
        });
    }

    const resultado = await enviarAlertaAsistenciaPorCurso(
      anio_curso,
      division,
      anio_lectivo,
      faltasMaximas,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({
      success: true,
      message: `Emails enviados al curso: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
      ...resultado,
    });
  } catch (error) {
    console.error("❌ Error al enviar alerta por curso:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar alerta por curso",
      error: error.message,
    });
  }
};

// Enviar notificación de reunión a un curso completo (MODIFICADO)
const EnviarNotificacionReunionPorCurso = async (req, res) => {
  try {
    const { anio_curso, division, anio_lectivo, reunionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario
    console.log("📥 Request reunión por curso:", {
      anio_curso,
      division,
      anio_lectivo,
    });
    if (!anio_curso) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "anio_curso" es requerido',
        });
    }
    if (!division) {
      return res
        .status(400)
        .json({ success: false, message: 'El campo "division" es requerido' });
    }
    if (!anio_lectivo) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "anio_lectivo" es requerido',
        });
    }

    if (!reunionData) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "reunionData" es requerido',
        });
    }

    const camposRequeridos = ["motivo", "fecha", "hora"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !reunionData[campo]
    );
    if (camposFaltantes.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos en reunionData: ${camposFaltantes.join(
            ", "
          )}`,
        });
    }

    const resultado = await enviarNotificacionReunionPorCurso(
      anio_curso,
      division,
      anio_lectivo,
      reunionData,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({
      success: true,
      message: `Emails enviados al curso: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
      ...resultado,
    });
  } catch (error) {
    console.error("❌ Error al enviar reunión por curso:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar reunión por curso",
      error: error.message,
    });
  }
};

// Enviar notificación general a un curso completo (MODIFICADO)
const EnviarNotificacionGeneralPorCurso = async (req, res) => {
  try {
    const { anio_curso, division, anio_lectivo, notificacionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario
    console.log("📥 Request notificación por curso:", {
      anio_curso,
      division,
      anio_lectivo,
    });
    if (!anio_curso) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "anio_curso" es requerido',
        });
    }
    if (!division) {
      return res
        .status(400)
        .json({ success: false, message: 'El campo "division" es requerido' });
    }
    if (!anio_lectivo) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "anio_lectivo" es requerido',
        });
    }

    if (!notificacionData) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "notificacionData" es requerido',
        });
    }

    const camposRequeridos = ["asunto", "mensaje"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !notificacionData[campo]
    );
    if (camposFaltantes.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos en notificacionData: ${camposFaltantes.join(
            ", "
          )}`,
        });
    }

    if (!notificacionData.tipo) {
      notificacionData.tipo = "informacion";
    }

    const resultado = await enviarNotificacionGeneralPorCurso(
      anio_curso,
      division,
      anio_lectivo,
      notificacionData,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({
      success: true,
      message: `Emails enviados al curso: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
      ...resultado,
    });
  } catch (error) {
    console.error("❌ Error al enviar notificación por curso:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar notificación por curso",
      error: error.message,
    });
  }
};

// Enviar notificación a múltiples cursos (MODIFICADO)
const EnviarNotificacionGeneralPorCursosMultiples = async (req, res) => {
  try {
    const { cursos, notificacionData } = req.body;
    const id_usuario = getUserId(req); // Obtener ID de usuario
    console.log("📥 Request notificación a múltiples cursos:", {
      cantidad: cursos?.length,
    });
    if (!cursos || !Array.isArray(cursos) || cursos.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'El campo "cursos" debe ser un array con al menos un curso { anio_curso, division, anio_lectivo }',
        });
    }

    if (!notificacionData) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'El campo "notificacionData" es requerido',
        });
    }

    const camposRequeridos = ["asunto", "mensaje"];
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !notificacionData[campo]
    );
    if (camposFaltantes.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Campos requeridos en notificacionData: ${camposFaltantes.join(
            ", "
          )}`,
        });
    }

    if (!notificacionData.tipo) {
      notificacionData.tipo = "informacion";
    }

    const resultado = await enviarNotificacionGeneralPorCursosMultiples(
      cursos,
      notificacionData,
      id_usuario
    ); // Pasar ID
    return res.status(200).json({
      success: true,
      message: `Emails enviados a ${resultado.totalCursos} cursos: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
      ...resultado,
    });
  } catch (error) {
    console.error("❌ Error al enviar notificación a múltiples cursos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar notificación a múltiples cursos",
      error: error.message,
    });
  }
};

module.exports = {
  // Existentes...
  TestMail,
  
  EnviarAlertaAsistencia,
  EnviarNotificacionReunion,
  EnviarNotificacionGeneral,
  ObtenerDatosAlumno,
  EnviarAlertaAsistenciaMasiva,
  EnviarNotificacionReunionMasiva,
  EnviarNotificacionGeneralMasiva, // Nuevos controllers por curso
  ObtenerCursosDisponibles,
  ObtenerAlumnosPorCurso, // CORREGIDO AQUÍ
  EnviarAlertaAsistenciaPorCurso,
  EnviarNotificacionReunionPorCurso,
  EnviarNotificacionGeneralPorCurso,
  EnviarNotificacionGeneralPorCursosMultiples,
};
