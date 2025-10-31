const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const pool = require("../config/db");
const {
  QUERY_REPORTE_ALUMNO,
} = require("../modules/reportesAlumnoDni/reporte.queries");
const {
  QUERY_ALUMNOS_POR_CURSO,
  QUERY_CURSOS_DISPONIBLES,
  QUERY_ALUMNOS_POR_CURSOS_MULTIPLES,
} = require("../modules/mail/mail.queries");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarMailTest = async (to) => {
  try {
    const info = await transporter.sendMail({
      from: `Servidor de pruebas <${process.env.EMAIL_USER}>`,
      to: to || "omegasuprime2585@gmail.com",
      subject: "Email de prueba",
      text: "Este es un email de prueba enviado desde el servidor Node.js usando Nodemailer",
      html: "<h1>Hola!</h1><p>Este es un email de prueba enviado desde el servidor Node.js usando Nodemailer</p>",
    });
    console.log("✅ Email de prueba enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error al enviar email de prueba:", error);
    throw error;
  }
};

const enviarRecuperacionPassword = async (mail, link) => {
  try {
    const info = await transporter.sendMail({
      from: `Instituto Carlos Guido Spano <${process.env.EMAIL_USER}>`,
      to: mail || "omegasuprime2585@gmail.com",
      subject: "🔐 Recuperación de Contraseña",
      text: "Este es un email de recuperacion de clave Node.js usando Nodemailer",
      html: "<h1>Hola!</h1><p>Este es un email de recuperacion de clave Node.js usando Nodemailer</p>",
    });
    console.log("✅ Email de recuperación enviado a:", mail);
    return info;
  } catch (error) {
    console.error("❌ Error al enviar email de recuperación:", error);
    throw error;
  }
};

// Función auxiliar para calcular asistencias
const calcularAsistencias = (materias) => {
  let totalPresentes = 0;
  let totalClases = 0;
  let totalAusentes = 0;

  Object.values(materias).forEach((materia) => {
    if (materia.asistencias && materia.asistencias.length > 0) {
      materia.asistencias.forEach((asistencia) => {
        totalClases++;
        if (asistencia.estado === "Presente") {
          totalPresentes++;
        } else if (
          asistencia.estado === "Ausente" ||
          asistencia.estado === "Ausente Justificado"
        ) {
          totalAusentes++;
        }
      });
    }
  });

  const porcentaje =
    totalClases > 0 ? ((totalPresentes / totalClases) * 100).toFixed(2) : 0;

  return {
    totalClases,
    totalPresentes,
    totalAusentes,
    porcentaje: parseFloat(porcentaje),
  };
};

// Obtener datos del alumno desde la BD
const obtenerDatosAlumno = async (dni, anio) => {
  try {
    const [rows] = await pool.execute(QUERY_REPORTE_ALUMNO, [dni, anio]);

    if (rows.length === 0) {
      throw new Error("Alumno no encontrado o sin datos para ese año lectivo.");
    }

    const alumno = {
      id: rows[0].id_alumno,
      dni: rows[0].dni_alumno,
      nombre: rows[0].nombre_alumno,
      apellido: rows[0].apellido_alumno,
      email: rows[0].email,
      estado: rows[0].estado,
      fecha_nacimiento: rows[0].fecha_nacimiento,
      fecha_inscripcion: rows[0].fecha_inscripcion,
      lugar_nacimiento: rows[0].lugar_nacimiento,
      direccion: rows[0].direccion,
      telefono: rows[0].telefono,
      curso: {
        id: rows[0].id_curso,
        nombre: rows[0].nombre_curso,
        division: rows[0].division,
        turno: rows[0].turno,
        anio_curso: rows[0].anio_curso,
        anio_lectivo: rows[0].anio_lectivo,
      },
      materias: {},
      tutores: [],
    };

    const tutoresSet = new Set();

    rows.forEach((r) => {
      if (r.nombre_materia) {
        if (!alumno.materias[r.nombre_materia]) {
          alumno.materias[r.nombre_materia] = {
            estado_final: r.estado_final_materia,
            calificacion_final: r.calificacion_final_materia,
            calificaciones: [],
            asistencias: [],
          };
        }

        if (r.cuatrimestre) {
          alumno.materias[r.nombre_materia].calificaciones.push({
            cuatrimestre: r.cuatrimestre,
            notas: [r.nota_1, r.nota_2, r.nota_3],
            promedio: r.promedio_cuatrimestre,
          });
        }

        if (r.fecha_clase) {
          alumno.materias[r.nombre_materia].asistencias.push({
            fecha: r.fecha_clase,
            estado: r.estado_asistencia,
          });
        }
      }

      if (r.id_tutor && !tutoresSet.has(r.id_tutor)) {
        alumno.tutores.push({
          id: r.id_tutor,
          nombre: r.nombre_tutor,
          apellido: r.apellido_tutor,
          dni_tutor: r.dni_tutor,
          direccion: r.direccion,
          parentesco: r.parentesco,
          telefono: r.telefono_tutor,
          email: r.email_tutor,
        });
        tutoresSet.add(r.id_tutor);
      }
    });

    return alumno;
  } catch (error) {
    console.error("❌ Error al obtener datos del alumno:", error);
    throw error;
  }
};

const enviarAlertaAsistencia = async (dni, anio, faltasMaximas = 20) => {
  try {
    // Obtener datos reales del alumno desde la BD
    const alumnoData = await obtenerDatosAlumno(dni, anio);

    // Calcular asistencias
    const asistencias = calcularAsistencias(alumnoData.materias);

    // Verificar si debe enviar alerta (90% o menos)
    if (asistencias.porcentaje > 90) {
      return {
        alerta_enviada: false,
        mensaje: `El alumno tiene ${asistencias.porcentaje}% de asistencia, no requiere alerta.`,
        datos_asistencia: asistencias,
      };
    }

    // Verificar si hay tutores
    if (alumnoData.tutores.length === 0) {
      throw new Error("El alumno no tiene tutores registrados.");
    }

    // Preparar datos para el email
    const datosEmail = {
      nombreAlumno: alumnoData.nombre,
      apellidoAlumno: alumnoData.apellido,
      curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division} - ${alumnoData.curso.turno}`,
      anioLectivo: alumnoData.curso.anio_lectivo,
      asistenciasPorcentaje: asistencias.porcentaje,
      faltasActuales: asistencias.totalAusentes,
      faltasMaximas: faltasMaximas,
      totalClases: asistencias.totalClases,
      clasesPresente: asistencias.totalPresentes,
    };

    // Enviar email a todos los tutores
    const emailsEnviados = [];
    for (const tutor of alumnoData.tutores) {
      if (tutor.email) {
        const info = await transporter.sendMail({
          from: `Instituto Carlos Guido Spano <${process.env.EMAIL_USER}>`,
          to: tutor.email,
          subject: `⚠️ Alerta de Asistencias - ${datosEmail.nombreAlumno} ${datosEmail.apellidoAlumno}`,
          html: generarHTMLAlertaAsistencia(datosEmail, tutor),
        });

        emailsEnviados.push({
          tutor: `${tutor.nombre} ${tutor.apellido}`,
          email: tutor.email,
          messageId: info.messageId,
        });

        console.log(`✅ Alerta de asistencia enviada a: ${tutor.email}`);
      }
    }

    return {
      alerta_enviada: true,
      mensaje: "Alerta de asistencia enviada correctamente",
      alumno: {
        dni: alumnoData.dni,
        nombre: `${alumnoData.nombre} ${alumnoData.apellido}`,
        curso: datosEmail.curso,
      },
      datos_asistencia: asistencias,
      emails_enviados: emailsEnviados,
    };
  } catch (error) {
    console.error("❌ Error al enviar alerta de asistencia:", error);
    throw error;
  }
};

// Función auxiliar para generar HTML de alerta de asistencia
const generarHTMLAlertaAsistencia = (datos, tutor) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                .alert-box { background-color: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; }
                .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
                .info-table td:first-child { font-weight: bold; width: 40%; background-color: #f5f5f5; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .warning-icon { font-size: 48px; text-align: center; margin: 10px 0; }
                .progress-bar { width: 100%; height: 30px; background-color: #e0e0e0; border-radius: 15px; overflow: hidden; margin: 10px 0; }
                .progress-fill { height: 100%; background-color: ${
                  datos.asistenciasPorcentaje >= 90 ? "#ff9800" : "#f44336"
                }; text-align: center; line-height: 30px; color: white; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚠️ Alerta de Asistencias</h1>
                </div>
                <div class="content">
                    <p>Estimado/a ${tutor.nombre} ${tutor.apellido},</p>
                    
                    <div class="warning-icon">⚠️</div>
                    <div class="alert-box">
                        <strong>Atención:</strong> El alumno está próximo a alcanzar el límite de faltas permitidas (${
                          datos.asistenciasPorcentaje
                        }% de asistencia).
                    </div>
                    
                    <h2>Información del Alumno</h2>
                    <table class="info-table">
                        <tr>
                            <td>Alumno:</td>
                            <td>${datos.nombreAlumno} ${
    datos.apellidoAlumno
  }</td>
                        </tr>
                        <tr>
                            <td>Curso:</td>
                            <td>${datos.curso}</td>
                        </tr>
                        <tr>
                            <td>Año Lectivo:</td>
                            <td>${datos.anioLectivo}</td>
                        </tr>
                    </table>

                    <h3>Resumen de Asistencias</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${
                          datos.asistenciasPorcentaje
                        }%;">
                            ${datos.asistenciasPorcentaje}%
                        </div>
                    </div>
                    
                    <table class="info-table">
                        <tr>
                            <td>Total de Clases:</td>
                            <td>${datos.totalClases}</td>
                        </tr>
                        <tr>
                            <td>Clases Presente:</td>
                            <td style="color: #4CAF50;"><strong>${
                              datos.clasesPresente
                            }</strong></td>
                        </tr>
                        <tr>
                            <td>Faltas Actuales:</td>
                            <td style="color: #f44336;"><strong>${
                              datos.faltasActuales
                            }</strong></td>
                        </tr>
                        <tr>
                            <td>Faltas Máximas:</td>
                            <td>${datos.faltasMaximas}</td>
                        </tr>
                        <tr>
                            <td>Faltas Restantes:</td>
                            <td><strong style="color: #d32f2f;">${
                              datos.faltasMaximas - datos.faltasActuales
                            }</strong></td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px;">
                        <strong>Recomendación:</strong> Se recomienda contactar con la institución para 
                        revisar la situación y tomar las medidas necesarias para mejorar la asistencia del alumno.
                    </p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático del Instituto Carlos Guido Spano.</p>
                    <p>Por favor, no responda a este correo.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const enviarNotificacionReunion = async (dni, anio, reunionData) => {
  try {
    // Obtener datos reales del alumno desde la BD
    const alumnoData = await obtenerDatosAlumno(dni, anio);

    // Verificar si hay tutores
    if (alumnoData.tutores.length === 0) {
      throw new Error("El alumno no tiene tutores registrados.");
    }

    const { motivo, fecha, hora, lugar, observaciones } = reunionData;

    // Enviar email a todos los tutores
    const emailsEnviados = [];
    for (const tutor of alumnoData.tutores) {
      if (tutor.email) {
        const info = await transporter.sendMail({
          from: `Sistema de Gestión Académica <${process.env.EMAIL_USER}>`,
          to: tutor.email,
          subject: `📅 Convocatoria a Reunión - ${motivo}`,
          html: generarHTMLReunion({
            nombreTutor: `${tutor.nombre} ${tutor.apellido}`,
            nombreAlumno: `${alumnoData.nombre} ${alumnoData.apellido}`,
            curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division} - ${alumnoData.curso.turno}`,
            motivo,
            fecha,
            hora,
            lugar,
            observaciones,
          }),
        });

        emailsEnviados.push({
          tutor: `${tutor.nombre} ${tutor.apellido}`,
          email: tutor.email,
          messageId: info.messageId,
        });

        console.log(`✅ Notificación de reunión enviada a: ${tutor.email}`);
      }
    }

    return {
      mensaje: "Notificación de reunión enviada correctamente",
      alumno: {
        dni: alumnoData.dni,
        nombre: `${alumnoData.nombre} ${alumnoData.apellido}`,
        curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division}`,
      },
      reunion: {
        motivo,
        fecha,
        hora,
        lugar,
      },
      emails_enviados: emailsEnviados,
    };
  } catch (error) {
    console.error("❌ Error al enviar notificación de reunión:", error);
    throw error;
  }
};

// Función auxiliar para generar HTML de reunión
const generarHTMLReunion = (datos) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                .reunion-box { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; }
                .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .info-table td { padding: 12px; border-bottom: 1px solid #ddd; }
                .info-table td:first-child { font-weight: bold; width: 30%; background-color: #f5f5f5; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .icon { font-size: 48px; text-align: center; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 Convocatoria a Reunión</h1>
                </div>
                <div class="content">
                    <div class="icon">📋</div>
                    
                    <p>Estimado/a ${datos.nombreTutor},</p>
                    
                    <p>Por medio del presente, le convocamos a una reunión referente al alumno <strong>${
                      datos.nombreAlumno
                    }</strong> del curso <strong>${datos.curso}</strong>.</p>
                    
                    <div class="reunion-box">
                        <strong>Motivo:</strong> ${datos.motivo}
                    </div>
                    
                    <table class="info-table">
                        <tr>
                            <td>📅 Fecha:</td>
                            <td><strong>${datos.fecha}</strong></td>
                        </tr>
                        <tr>
                            <td>🕐 Hora:</td>
                            <td><strong>${datos.hora}</strong></td>
                        </tr>
                        <tr>
                            <td>📍 Lugar:</td>
                            <td>${datos.lugar || "A confirmar"}</td>
                        </tr>
                    </table>
                    
                    ${
                      datos.observaciones
                        ? `
                    <div style="margin: 20px 0; padding: 15px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px;">
                        <strong>Observaciones:</strong>
                        <p style="margin: 10px 0 0 0;">${datos.observaciones}</p>
                    </div>
                    `
                        : ""
                    }
                    
                    <p style="margin-top: 20px;">
                        Su asistencia es importante. Por favor, confirme su participación contactando a la institución.
                    </p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático del Sistema de Gestión Académica.</p>
                    <p>Por favor, no responda a este correo.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const enviarNotificacionGeneral = async (dni, anio, notificacionData) => {
  try {
    // Obtener datos reales del alumno desde la BD
    const alumnoData = await obtenerDatosAlumno(dni, anio);

    // Verificar si hay tutores
    if (alumnoData.tutores.length === 0) {
      throw new Error("El alumno no tiene tutores registrados.");
    }

    const { asunto, mensaje, tipo = "informacion" } = notificacionData;

    // Definir colores y emojis según el tipo
    const tiposConfig = {
      informacion: { color: "#2196F3", emoji: "ℹ️", titulo: "Información" },
      aviso: { color: "#ff9800", emoji: "⚠️", titulo: "Aviso Importante" },
      recordatorio: { color: "#4CAF50", emoji: "🔔", titulo: "Recordatorio" },
      urgente: {
        color: "#f44336",
        emoji: "🚨",
        titulo: "Notificación Urgente",
      },
    };

    const config = tiposConfig[tipo] || tiposConfig.informacion;

    // Enviar email a todos los tutores
    const emailsEnviados = [];
    for (const tutor of alumnoData.tutores) {
      if (tutor.email) {
        const info = await transporter.sendMail({
          from: `Instituto Carlos Guido Spano <${process.env.EMAIL_USER}>`,
          to: tutor.email,
          subject: `${config.emoji} ${asunto}`,
          html: generarHTMLNotificacionGeneral({
            nombreTutor: `${tutor.nombre} ${tutor.apellido}`,
            nombreAlumno: `${alumnoData.nombre} ${alumnoData.apellido}`,
            curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division} - ${alumnoData.curso.turno}`,
            asunto,
            mensaje,
            config,
          }),
        });

        emailsEnviados.push({
          tutor: `${tutor.nombre} ${tutor.apellido}`,
          email: tutor.email,
          messageId: info.messageId,
        });

        console.log(`✅ Notificación general enviada a: ${tutor.email}`);
      }
    }

    return {
      mensaje: "Notificación enviada correctamente",
      alumno: {
        dni: alumnoData.dni,
        nombre: `${alumnoData.nombre} ${alumnoData.apellido}`,
        curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division}`,
      },
      tipo: tipo,
      asunto: asunto,
      emails_enviados: emailsEnviados,
    };
  } catch (error) {
    console.error("❌ Error al enviar notificación general:", error);
    throw error;
  }
};

// Función auxiliar para generar HTML de notificación general
const generarHTMLNotificacionGeneral = (datos) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: ${datos.config.color}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
                .message-box { background-color: white; padding: 20px; border-left: 4px solid ${datos.config.color}; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .alumno-info { background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${datos.config.emoji} ${datos.config.titulo}</h1>
                </div>
                <div class="content">
                    <p>Estimado/a ${datos.nombreTutor},</p>
                    
                    <div class="alumno-info">
                        <strong>Referente a:</strong> ${datos.nombreAlumno} - ${datos.curso}
                    </div>
                    
                    <h2 style="color: ${datos.config.color};">${datos.asunto}</h2>
                    
                    <div class="message-box">
                        ${datos.mensaje}
                    </div>
                    
                    <p style="margin-top: 20px; color: #666;">
                        Si tiene alguna consulta, no dude en contactar con la institución.
                    </p>
                </div>
                <div class="footer">
                    <p>Este es un correo automático del Sistema de Gestión Académica.</p>
                    <p>Por favor, no responda a este correo.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
// Función para enviar alertas masivas de asistencia
const enviarAlertaAsistenciaMasiva = async (
  dniArray,
  anio,
  faltasMaximas = 20
) => {
  try {
    const resultados = [];
    const errores = [];

    console.log(`📧 Iniciando envío masivo a ${dniArray.length} alumnos...`);

    for (const dni of dniArray) {
      try {
        console.log(`🔄 Procesando alumno DNI: ${dni}`);
        const resultado = await enviarAlertaAsistencia(
          dni,
          anio,
          faltasMaximas
        );

        resultados.push({
          dni,
          success: true,
          ...resultado,
        });

        console.log(`✅ Email enviado a tutores de alumno DNI: ${dni}`);
      } catch (error) {
        console.error(`❌ Error con alumno DNI ${dni}:`, error.message);
        errores.push({
          dni,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: dniArray.length,
      exitosos: resultados.length,
      fallidos: errores.length,
      resultados,
      errores,
    };
  } catch (error) {
    console.error("❌ Error en envío masivo:", error);
    throw error;
  }
};

// Función para enviar notificaciones de reunión masivas
const enviarNotificacionReunionMasiva = async (dniArray, anio, reunionData) => {
  try {
    const resultados = [];
    const errores = [];

    console.log(
      `📧 Iniciando envío masivo de reunión a ${dniArray.length} alumnos...`
    );

    for (const dni of dniArray) {
      try {
        console.log(`🔄 Procesando alumno DNI: ${dni}`);
        const resultado = await enviarNotificacionReunion(
          dni,
          anio,
          reunionData
        );

        resultados.push({
          dni,
          success: true,
          ...resultado,
        });

        console.log(`✅ Notificación de reunión enviada a: ${dni}`);
      } catch (error) {
        console.error(`❌ Error con alumno DNI ${dni}:`, error.message);
        errores.push({
          dni,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: dniArray.length,
      exitosos: resultados.length,
      fallidos: errores.length,
      resultados,
      errores,
    };
  } catch (error) {
    console.error("❌ Error en envío masivo:", error);
    throw error;
  }
};

// Función para enviar notificaciones generales masivas (CORREGIDA)
const enviarNotificacionGeneralMasiva = async (
  dniArray,
  anio_lectivo, // Renombrado a anio_lectivo para mayor claridad
  notificacionData
) => {
  try {
    const resultados = [];
    const errores = [];

    console.log(
      `📧 Iniciando envío masivo de notificación a ${dniArray.length} alumnos...`
    );

    for (const dni of dniArray) {
      try {
        console.log(`🔄 Procesando alumno DNI: ${dni}`);
        // CORRECCIÓN: Se pasa el anio_lectivo (que es el 2do parámetro) a enviarNotificacionGeneral
        const resultado = await enviarNotificacionGeneral(
          dni,
          anio_lectivo, // Se usa el parámetro que sí existe
          notificacionData
        );

        resultados.push({
          dni,
          success: true,
          ...resultado,
        });

        console.log(`✅ Email enviado a tutores de alumno DNI: ${dni}`);
      } catch (error) {
        console.error(`❌ Error con alumno DNI ${dni}:`, error.message);
        errores.push({
          dni,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: dniArray.length,
      exitosos: resultados.length,
      fallidos: errores.length,
      resultados,
      errores,
    };
  } catch (error) {
    console.error("❌ Error en envío masivo:", error);
    throw error;
  }
};

// Obtener alumnos de un curso
const obtenerCursosDisponibles = async (anio) => {
  try {
    const [rows] = await pool.execute(QUERY_CURSOS_DISPONIBLES, [anio]);
    return rows;
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    throw error;
  }
};

// Obtener alumnos de un curso (MODIFICADO)
// Ahora busca por anio de curso, división y año lectivo
const obtenerAlumnosPorCurso = async (anio_curso, division, anio_lectivo) => {
  try {
    // En este punto, 'idCurso' en la query se reemplaza por anio_curso y division
    // Asumiendo que QUERY_ALUMNOS_POR_CURSO se adaptará para usar estos 3 parámetros.
    const [rows] = await pool.execute(
      QUERY_ALUMNOS_POR_CURSO,
      [anio_curso, division, anio_lectivo] // Nuevos parámetros para la consulta
    );

    if (rows.length === 0) {
      throw new Error(
        `No se encontraron alumnos activos en el curso ${anio_curso} "${division}" para el año lectivo ${anio_lectivo}`
      );
    }

    return rows.map((row) => ({
      id: row.id_alumno,
      dni: row.dni_alumno,
      nombre: row.nombre_alumno,
      apellido: row.apellido_alumno,
      email: row.email,
      curso: {
        id: row.id_curso,
        nombre: row.nombre_curso,
        division: row.division,
        turno: row.turno,
        anio_curso: row.anio_curso,
      },
    }));
  } catch (error) {
    console.error("❌ Error al obtener alumnos por curso:", error);
    throw error;
  }
};

// Obtener alumnos de múltiples cursos (MODIFICADO - Sin anioLectivo como argumento separado)
const obtenerAlumnosPorCursosMultiples = async (cursos) => {
    try {
        const params = [];
        const whereClauses = [];
        const baseQuery = `
            SELECT DISTINCT
                a.id_alumno, a.dni_alumno, a.nombre_alumno, a.apellido_alumno, a.email,
                c.id_curso, c.nombre AS nombre_curso, c.division, c.turno, c.anio AS anio_curso
            FROM alumno a  /* <--- CLÁUSULA FROM AÑADIDA O VERIFICADA CORRECTAMENTE */
            JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
            JOIN curso c ON ac.id_curso = c.id_curso
            WHERE a.estado = 'activo' AND (
        `;
        
        cursos.forEach((curso) => {
            // Se asume que cada elemento de 'cursos' contiene { anio_curso, division, anio_lectivo }
            if (curso.anio_curso && curso.division && curso.anio_lectivo) {
                 whereClauses.push(`(c.anio = ? AND c.division = ? AND ac.anio_lectivo = ?)`);
                 params.push(curso.anio_curso, curso.division, curso.anio_lectivo);
            }
        });
        
        if (whereClauses.length === 0) {
            throw new Error('El array "cursos" no contiene combinaciones válidas (anio_curso, division, anio_lectivo).');
        }

        const finalQuery = `${baseQuery} ${whereClauses.join(' OR ')} ) ORDER BY c.anio, c.division, a.apellido_alumno, a.nombre_alumno;`;

        console.log('Generated Multi-Course Query:', finalQuery); 
        
        const [rows] = await pool.execute(finalQuery, params);
        console.log('Generated Multi-Course Query:', finalQuery); 
        
        
        
        if (rows.length === 0) {
            throw new Error(`No se encontraron alumnos activos en los cursos seleccionados.`);
        }

        return rows.map(row => ({
            id: row.id_alumno,
            dni: row.dni_alumno,
            nombre: row.nombre_alumno,
            apellido: row.apellido_alumno,
            email: row.email,
            curso: {
                id: row.id_curso,
                nombre: row.nombre_curso,
                division: row.division,
                turno: row.turno,
                anio: row.anio_curso
            }
        }));
    } catch (error) {
        console.error('❌ Error al obtener alumnos por cursos múltiples:', error);
        throw error;
    }
};

// Enviar alerta de asistencia a todo un curso (MODIFICADO)
const enviarAlertaAsistenciaPorCurso = async (
  anio_curso,
  division,
  anio_lectivo,
  faltasMaximas = 20
) => {
  try {
    console.log(
      `📧 Iniciando envío masivo al curso ${anio_curso} "${division}" - Año Lectivo ${anio_lectivo}...`
    );

    // Obtener alumnos del curso usando los nuevos parámetros
    const alumnos = await obtenerAlumnosPorCurso(
      anio_curso,
      division,
      anio_lectivo
    );
    const dnis = alumnos.map((alumno) => alumno.dni);

    console.log(`👥 Alumnos encontrados: ${alumnos.length}`);

    // Reutilizar la función masiva existente, pasando anio_lectivo como 'anio'
    const resultado = await enviarAlertaAsistenciaMasiva(
      dnis,
      anio_lectivo,
      faltasMaximas
    );

    return {
      curso: alumnos.length > 0 ? alumnos[0].curso : { anio_curso, division },
      totalAlumnos: alumnos.length,
      ...resultado,
    };
  } catch (error) {
    console.error("❌ Error al enviar alerta por curso:", error);
    throw error;
  }
};

// Enviar notificación de reunión a todo un curso (MODIFICADO)
const enviarNotificacionReunionPorCurso = async (
  anio_curso,
  division,
  anio_lectivo,
  reunionData
) => {
  try {
    console.log(
      `📧 Iniciando envío de reunión al curso ${anio_curso} "${division}" - Año Lectivo ${anio_lectivo}...`
    );

    const alumnos = await obtenerAlumnosPorCurso(
      anio_curso,
      division,
      anio_lectivo
    );
    const dnis = alumnos.map((alumno) => alumno.dni);

    console.log(`👥 Alumnos encontrados: ${alumnos.length}`);

    const resultado = await enviarNotificacionReunionMasiva(
      dnis,
      anio_lectivo,
      reunionData
    );

    return {
      curso: alumnos.length > 0 ? alumnos[0].curso : { anio_curso, division },
      totalAlumnos: alumnos.length,
      ...resultado,
    };
  } catch (error) {
    console.error("❌ Error al enviar reunión por curso:", error);
    throw error;
  }
};

// Enviar notificación general a todo un curso (MODIFICADO)
const enviarNotificacionGeneralPorCurso = async (
  anio_curso,
  division,
  anio_lectivo,
  notificacionData
) => {
  try {
    console.log(
      `📧 Iniciando envío de notificación al curso ${anio_curso} "${division}" - Año Lectivo ${anio_lectivo}...`
    );

    const alumnos = await obtenerAlumnosPorCurso(
      anio_curso,
      division,
      anio_lectivo
    );
    const dnis = alumnos.map((alumno) => alumno.dni);

    console.log(`👥 Alumnos encontrados: ${alumnos.length}`);

    const resultado = await enviarNotificacionGeneralMasiva(
      dnis,
      anio_lectivo,
      notificacionData
    );

    return {
      curso: alumnos.length > 0 ? alumnos[0].curso : { anio_curso, division },
      totalAlumnos: alumnos.length,
      ...resultado,
    };
  } catch (error) {
    console.error("❌ Error al enviar notificación por curso:", error);
    throw error;
  }
};

// Enviar a múltiples cursos (MODIFICADO - Opcion 1 aplicada)
const enviarNotificacionGeneralPorCursosMultiples = async (
  cursos,
  notificacionData
) => {
  try {
    console.log(`📧 Iniciando envío a ${cursos.length} cursos...`); // Obtener alumnos de múltiples cursos usando la lista de objetos de curso
    const alumnos = await obtenerAlumnosPorCursosMultiples(cursos);
    const dnis = alumnos.map((alumno) => alumno.dni);
    console.log(`👥 Alumnos encontrados: ${alumnos.length}`); // Tomamos el año lectivo del primer curso, o 2025 por defecto,

    // ya que la función masiva lo usa como parámetro histórico.
    const anioReferencia = cursos[0]?.anio_lectivo || new Date().getFullYear();
    const resultado = await enviarNotificacionGeneralMasiva(
      dnis,
      anioReferencia,
      notificacionData
    ); // Agrupar por curso (para el reporte de respuesta)
    const alumnosPorCurso = alumnos.reduce((acc, alumno) => {
      const cursoKey = `${alumno.curso.anio}/${alumno.curso.division}/${alumno.curso.id}`;
      if (!acc[cursoKey]) {
        acc[cursoKey] = {
          curso: alumno.curso,
          cantidad: 0,
        };
      }
      acc[cursoKey].cantidad++;
      return acc;
    }, {});
    return {
      cursos_enviados: Object.values(alumnosPorCurso),
      totalAlumnos: alumnos.length,
      totalCursos: cursos.length,
      ...resultado,
    };
  } catch (error) {
    console.error("❌ Error al enviar notificación a múltiples cursos:", error);
    throw error;
  }
};

// ... (resto de las funciones de servicio, incluyendo obtenerAlumnosPorCurso, que ahora usa los 3 parámetros) ...

module.exports = {
  // Existentes
  enviarMailTest,
  enviarRecuperacionPassword,
  enviarAlertaAsistencia,
  enviarNotificacionReunion,
  enviarNotificacionGeneral,
  obtenerDatosAlumno,
  enviarAlertaAsistenciaMasiva,
  enviarNotificacionReunionMasiva,
  enviarNotificacionGeneralMasiva,
  // Nuevas funciones por curso
  obtenerCursosDisponibles,
  obtenerAlumnosPorCurso, // Modificado
  obtenerAlumnosPorCursosMultiples, // Modificado
  enviarAlertaAsistenciaPorCurso, // Modificado
  enviarNotificacionReunionPorCurso, // Modificado
  enviarNotificacionGeneralPorCurso, // Modificado
  enviarNotificacionGeneralPorCursosMultiples, // Modificado
};