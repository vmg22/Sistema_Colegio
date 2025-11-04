const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const pool = require("../config/db");
const {
  QUERY_REPORTE_ALUMNO,
} = require("../modules/reportesAlumnoDni/reporte.queries");
const {
  QUERY_ALUMNOS_POR_CURSO,
  QUERY_CURSOS_DISPONIBLES,
  // Se asume que estas queries están en mail.queries.js:
  QUERY_INSERT_COMUNICACION, 
  QUERY_INSERT_DESTINATARIO,
} = require("../modules/mail/mail.queries"); // IMPORTACIONES NECESARIAS
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

console.log('🔧 Transporter creado con:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  User:', process.env.EMAIL_USER ? '✅' : '❌ FALTA');
console.log('  Pass:', process.env.EMAIL_PASS ? '✅' : '❌ FALTA');
// ===============================================
// FUNCIONES BASE
// ===============================================

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

const enviarRecuperacionPassword = async (mail, resetLink, username) => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Configuración de email no encontrada en variables de entorno');
    }

    console.log('=== INICIANDO ENVÍO DE EMAIL ===');
    console.log('📧 Para:', mail);
    console.log('🔗 Link completo:', resetLink);
    console.log('👤 Usuario:', username);
    
    // Verificar que el link tenga un token válido
    if (!resetLink.includes('token=') || !resetLink.split('token=')[1] || resetLink.split('token=')[1].length < 10) {
      throw new Error('El link de reset no contiene un token válido');
    }

    const mailOptions = {
      from: `Instituto Carlos Guido Spano <${process.env.EMAIL_USER}>`,
      to: mail,
      subject: "Recuperación de Contraseña - Sistema de Gestión",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background-color: #5b68df;
              color: white;
              padding: 25px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .button {
              display: inline-block;
              padding: 14px 35px;
              background-color: #5b68df;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
              font-size: 16px;
            }
            .button:hover {
              background-color: #4a56c4;
            }
            .footer {
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .link-box {
              background-color: #f8f9fa;
              padding: 12px;
              border: 1px solid #dee2e6;
              border-radius: 4px;
              word-break: break-all;
              font-family: monospace;
              font-size: 12px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <h2>Hola, ${username || "Usuario"}!</h2>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el <strong>Sistema de Gestión del Colegio Carlos Guido Spano</strong>.</p>
              
              <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button" style="color: white;">🎯 RESTABLECER CONTRASEÑA</a>
              </div>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <div class="link-box">
                ${resetLink}
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Este enlace es válido por <strong>1 hora</strong></li>
                  <li>Si no solicitaste este cambio, ignora este correo</li>
                  <li>Tu contraseña actual seguirá siendo válida hasta que la cambies</li>
                  <li>Nunca compartas este enlace con otras personas</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <em>¿No solicitaste este cambio? Si recibiste este correo por error, puedes ignorarlo de forma segura.</em>
              </p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p><strong>&copy; ${new Date().getFullYear()} Colegio Carlos Guido Spano - Sistema de Gestión</strong></p>
              <p style="font-size: 11px; color: #999;">
                Dirección: [Dirección del colegio] | Teléfono: [Teléfono] | Email: [Email de contacto]
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión texto plano como alternativa
      text: `
        RECUPERACIÓN DE CONTRASEÑA
        ==========================

        Hola, ${username || "Usuario"}!

        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta 
        en el Sistema de Gestión del Colegio Carlos Guido Spano.

        Para crear una nueva contraseña, haz clic en el siguiente enlace:
        ${resetLink}

        Si el enlace no funciona, cópialo y pégalo en tu navegador.

        ⚠️ IMPORTANTE:
        - Este enlace es válido por 1 hora
        - Si no solicitaste este cambio, ignora este correo
        - Tu contraseña actual seguirá siendo válida hasta que la cambies
        - Nunca compartas este enlace con otras personas

        ¿No solicitaste este cambio? Si recibiste este correo por error, 
        puedes ignorarlo de forma segura.

        --
        Este es un correo automático, por favor no respondas a este mensaje.

        © ${new Date().getFullYear()} Colegio Carlos Guido Spano - Sistema de Gestión
        Dirección: [Dirección del colegio] | Teléfono: [Teléfono] 
      `,
    };

    console.log('📤 Enviando email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email enviado exitosamente:", info.messageId);
    console.log("📨 Respuesta:", info.response);
    
    return info;
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
    console.error("🔧 Detalles del error:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    throw new Error(`No se pudo enviar el correo de recuperación: ${error.message}`);
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

// ===============================================
// FUNCIÓN CENTRAL DE REGISTRO EN BASE DE DATOS (NUEVA)
// ===============================================

/**
 * Registra la comunicación y sus destinatarios en la base de datos.
 * @param {object} notificacionData - Contiene asunto, mensaje/motivo.
 * @param {number} id_usuario - ID del usuario que envía.
 * @param {string} destinatario_tipo - Tipo de destinatario (curso, alumno, etc.).
 * @param {Array<object>} resultados - Array de resultados de envíos exitosos.
 * @returns {number} id_comunicacion insertado.
 */
const registrarComunicacion = async (notificacionData, id_usuario, destinatario_tipo, resultados) => {
    // Si no hay resultados exitosos para registrar, salimos.
    if (!resultados || resultados.length === 0) return null;
    
    // 1. Insertar en la tabla comunicacion
    const asunto = notificacionData.asunto || notificacionData.motivo || 'Alerta de Asistencia';
    const contenido = notificacionData.mensaje || notificacionData.motivo || 'Alerta de Asistencia';
    
    const [comunicacionResult] = await pool.execute(
        QUERY_INSERT_COMUNICACION,
        [asunto, contenido, id_usuario || 0, destinatario_tipo]
    );

    const id_comunicacion = comunicacionResult.insertId;

    // 2. Preparar inserciones masivas en comunicacion_destinatario
    const destinatarioPromises = [];

    for (const resultado of resultados) {
        // Enviar a todos los emails/tutores listados en el resultado
        const emails_enviados = resultado.emails_enviados || [];
        const id_alumno_db = resultado.alumno?.id || null; 
        const id_curso_db = resultado.alumno?.curso?.id || null; 

        for (const emailInfo of emails_enviados) {
            if (emailInfo.email) {
                destinatarioPromises.push(
                    pool.execute(
                        QUERY_INSERT_DESTINATARIO,
                        [
                            id_comunicacion, 
                            id_alumno_db, 
                            id_curso_db,
                            emailInfo.tutor_id || null, 
                            emailInfo.email,
                            1 // 1 si fue procesado para envío
                        ]
                    )
                );
            }
        }
    }

    await Promise.all(destinatarioPromises);
    return id_comunicacion;
};
// ===============================================
// FUNCIONES HTML AUXILIARES (COMPLETAS)
// ===============================================

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

// ===============================================
// FUNCIONES SINGULARES (MODIFICADAS para registro)
// ===============================================

const enviarAlertaAsistencia = async (dni, anio, faltasMaximas = 20, id_usuario = 0) => {
  try {
    const alumnoData = await obtenerDatosAlumno(dni, anio);
    const asistencias = calcularAsistencias(alumnoData.materias);
    
    // Si no requiere alerta, salimos
    if (asistencias.porcentaje > 90) {
      return { alerta_enviada: false, mensaje: `El alumno tiene ${asistencias.porcentaje}% de asistencia, no requiere alerta.`, datos_asistencia: asistencias, };
    }

    if (alumnoData.tutores.length === 0) {
      throw new Error("El alumno no tiene tutores registrados.");
    }

    const datosEmail = {
      nombreAlumno: alumnoData.nombre, apellidoAlumno: alumnoData.apellido,
      curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division} - ${alumnoData.curso.turno}`,
      anioLectivo: alumnoData.curso.anio_lectivo,
      asistenciasPorcentaje: asistencias.porcentaje, faltasActuales: asistencias.totalAusentes,
      faltasMaximas: faltasMaximas, totalClases: asistencias.totalClases, clasesPresente: asistencias.totalPresentes
    };

    const emailsEnviados = [];
    const resultadosRegistro = { alumno: { dni: alumnoData.dni, id: alumnoData.id, email: alumnoData.email, curso: alumnoData.curso }, emails_enviados: [] };
    
    for (const tutor of alumnoData.tutores) {
      if (tutor.email) {
        const info = await transporter.sendMail({
          from: `Instituto Carlos Guido Spano <${process.env.EMAIL_USER}>`,
          to: tutor.email,
          subject: `⚠️ Alerta de Asistencias - ${datosEmail.nombreAlumno} ${datosEmail.apellidoAlumno}`,
          html: generarHTMLAlertaAsistencia(datosEmail, tutor),
        });
        
        emailsEnviados.push({ tutor: `${tutor.nombre} ${tutor.apellido}`, email: tutor.email, messageId: info.messageId, tutor_id: tutor.id });
        resultadosRegistro.emails_enviados.push({ email: tutor.email, tutor_id: tutor.id });
        console.log(`✅ Alerta de asistencia enviada a: ${tutor.email}`);
      }
    }

    // REGISTRO EN BASE DE DATOS
    let id_comunicacion = await registrarComunicacion(
        { asunto: `Alerta de Asistencia (${datosEmail.faltasActuales}/${datosEmail.faltasMaximas})`, motivo: 'Alerta de Asistencia' },
        id_usuario,
        'alumno', 
        [resultadosRegistro]
    );

    return {
      alerta_enviada: true,
      mensaje: "Alerta de asistencia enviada correctamente",
      alumno: { dni: alumnoData.dni, nombre: `${alumnoData.nombre} ${alumnoData.apellido}`, curso: datosEmail.curso, id: alumnoData.id },
      datos_asistencia: asistencias,
      emails_enviados: emailsEnviados,
      id_comunicacion: id_comunicacion
    };
  } catch (error) {
    console.error("❌ Error al enviar alerta de asistencia:", error);
    throw error;
  }
};

const enviarNotificacionReunion = async (dni, anio, reunionData, id_usuario = 0) => {
  try {
    const alumnoData = await obtenerDatosAlumno(dni, anio);
    if (alumnoData.tutores.length === 0) {
      throw new Error("El alumno no tiene tutores registrados.");
    }

    const { motivo, fecha, hora, lugar, observaciones } = reunionData;
    const emailsEnviados = [];
    const resultadosRegistro = { alumno: { dni: alumnoData.dni, id: alumnoData.id, email: alumnoData.email, curso: alumnoData.curso }, emails_enviados: [] };

    for (const tutor of alumnoData.tutores) {
      if (tutor.email) {
        const info = await transporter.sendMail({
          from: `Sistema de Gestión Académica <${process.env.EMAIL_USER}>`,
          to: tutor.email,
          subject: `📅 Convocatoria a Reunión - ${motivo}`,
          html: generarHTMLReunion({
            nombreTutor: `${tutor.nombre} ${tutor.apellido}`, nombreAlumno: `${alumnoData.nombre} ${alumnoData.apellido}`,
            curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division} - ${alumnoData.curso.turno}`,
            motivo, fecha, hora, lugar, observaciones,
          }),
        });
        
        emailsEnviados.push({ tutor: `${tutor.nombre} ${tutor.apellido}`, email: tutor.email, messageId: info.messageId, tutor_id: tutor.id });
        resultadosRegistro.emails_enviados.push({ email: tutor.email, tutor_id: tutor.id });
        console.log(`✅ Notificación de reunión enviada a: ${tutor.email}`);
      }
    }

    // REGISTRO EN BASE DE DATOS
    let id_comunicacion = await registrarComunicacion(
        reunionData,
        id_usuario,
        'alumno',
        [resultadosRegistro]
    );

    return {
      mensaje: "Notificación de reunión enviada correctamente",
      alumno: { dni: alumnoData.dni, nombre: `${alumnoData.nombre} ${alumnoData.apellido}`, curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division}`, id: alumnoData.id },
      reunion: { motivo, fecha, hora, lugar },
      emails_enviados: emailsEnviados,
      id_comunicacion: id_comunicacion
    };

  } catch (error) {
    console.error("❌ Error al enviar notificación de reunión:", error);
    throw error;
  }
};

const enviarNotificacionGeneral = async (dni, anio, notificacionData, id_usuario = 0) => {
  try {
    const alumnoData = await obtenerDatosAlumno(dni, anio);
    if (alumnoData.tutores.length === 0) {
      throw new Error("El alumno no tiene tutores registrados.");
    }

    const { asunto, mensaje, tipo = "informacion" } = notificacionData;
    const tiposConfig = {
      informacion: { color: "#2196F3", emoji: "ℹ️", titulo: "Información" },
      aviso: { color: "#ff9800", emoji: "⚠️", titulo: "Aviso Importante" },
      recordatorio: { color: "#4CAF50", emoji: "🔔", titulo: "Recordatorio" },
      urgente: { color: "#f44336", emoji: "🚨", titulo: "Notificación Urgente", },
    };
    const config = tiposConfig[tipo] || tiposConfig.informacion;

    const emailsEnviados = [];
    const resultadosRegistro = { alumno: { dni: alumnoData.dni, id: alumnoData.id, email: alumnoData.email, curso: alumnoData.curso }, emails_enviados: [] };
    
    for (const tutor of alumnoData.tutores) {
      if (tutor.email) {
        const info = await transporter.sendMail({
          from: `Instituto Carlos Guido Spano <${process.env.EMAIL_USER}>`,
          to: tutor.email,
          subject: `${config.emoji} ${asunto}`,
          html: generarHTMLNotificacionGeneral({
            nombreTutor: `${tutor.nombre} ${tutor.apellido}`, nombreAlumno: `${alumnoData.nombre} ${alumnoData.apellido}`,
            curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division} - ${alumnoData.curso.turno}`, asunto, mensaje, config,
          }),
        });
        
        emailsEnviados.push({ tutor: `${tutor.nombre} ${tutor.apellido}`, email: tutor.email, messageId: info.messageId, tutor_id: tutor.id });
        resultadosRegistro.emails_enviados.push({ email: tutor.email, tutor_id: tutor.id });
        console.log(`✅ Notificación general enviada a: ${tutor.email}`);
      }
    }
    
    // REGISTRO EN BASE DE DATOS
    let id_comunicacion = await registrarComunicacion(
        notificacionData,
        id_usuario,
        'alumno',
        [resultadosRegistro]
    );

    return {
      mensaje: "Notificación enviada correctamente",
      alumno: { dni: alumnoData.dni, nombre: `${alumnoData.nombre} ${alumnoData.apellido}`, curso: `${alumnoData.curso.nombre} ${alumnoData.curso.division}`, id: alumnoData.id },
      tipo: tipo, asunto: asunto,
      emails_enviados: emailsEnviados,
      id_comunicacion: id_comunicacion
    };

  } catch (error) {
    console.error("❌ Error al enviar notificación general:", error);
    throw error;
  }
};

// ===============================================
// FUNCIONES MASIVAS (Solo buclean y propagan ID de usuario)
// ===============================================

const enviarAlertaAsistenciaMasiva = async (dniArray, anio, faltasMaximas = 20, id_usuario = 0) => {
  try {
    const resultados = [];
    const errores = [];
    console.log(`📧 Iniciando envío masivo a ${dniArray.length} alumnos...`);

    for (const dni of dniArray) {
      try {
        console.log(`🔄 Procesando alumno DNI: ${dni}`);
        // Propaga el id_usuario a la función singular que registra
        const resultado = await enviarAlertaAsistencia(dni, anio, faltasMaximas, id_usuario);

        resultados.push({ dni, success: true, ...resultado, });
        console.log(`✅ Email enviado a tutores de alumno DNI: ${dni}`);
      } catch (error) {
        console.error(`❌ Error con alumno DNI ${dni}:`, error.message);
        errores.push({ dni, success: false, error: error.message, });
      }
    }

    return { total: dniArray.length, exitosos: resultados.length, fallidos: errores.length, resultados, errores, };
  } catch (error) {
    console.error("❌ Error en envío masivo:", error);
    throw error;
  }
};

const enviarNotificacionReunionMasiva = async (dniArray, anio, reunionData, id_usuario = 0) => {
  try {
    const resultados = [];
    const errores = [];
    console.log(`📧 Iniciando envío masivo de reunión a ${dniArray.length} alumnos...`);

    for (const dni of dniArray) {
      try {
        console.log(`🔄 Procesando alumno DNI: ${dni}`);
        // Propaga el id_usuario a la función singular que registra
        const resultado = await enviarNotificacionReunion(dni, anio, reunionData, id_usuario);

        resultados.push({ dni, success: true, ...resultado, });
        console.log(`✅ Notificación de reunión enviada a: ${dni}`);
      } catch (error) {
        console.error(`❌ Error con alumno DNI ${dni}:`, error.message);
        errores.push({ dni, success: false, error: error.message, });
      }
    }

    return { total: dniArray.length, exitosos: resultados.length, fallidos: errores.length, resultados, errores, };
  } catch (error) {
    console.error("❌ Error en envío masivo:", error);
    throw error;
  }
};

const enviarNotificacionGeneralMasiva = async (dniArray, anio_lectivo, notificacionData, id_usuario = 0) => {
  try {
    const resultados = [];
    const errores = [];
    console.log(`📧 Iniciando envío masivo de notificación a ${dniArray.length} alumnos...`);

    for (const dni of dniArray) {
      try {
        console.log(`🔄 Procesando alumno DNI: ${dni}`);
        // Propaga el id_usuario a la función singular que registra
        const resultado = await enviarNotificacionGeneral(dni, anio_lectivo, notificacionData, id_usuario);

        resultados.push({ dni, success: true, ...resultado, });
        console.log(`✅ Email enviado a tutores de alumno DNI: ${dni}`);
      } catch (error) {
        console.error(`❌ Error con alumno DNI ${dni}:`, error.message);
        errores.push({ dni, success: false, error: error.message, });
      }
    }

    return { total: dniArray.length, exitosos: resultados.length, fallidos: errores.length, resultados, errores, };
  } catch (error) {
    console.error("❌ Error en envío masivo:", error);
    throw error;
  }
};

// ===============================================
// FUNCIONES DE CURSO (Propagan el id_usuario)
// ===============================================

const obtenerCursosDisponibles = async (anio) => {
  try {
    const [rows] = await pool.execute(QUERY_CURSOS_DISPONIBLES, [anio]);
    return rows;
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    throw error;
  }
};

const obtenerAlumnosPorCurso = async (anio_curso, division, anio_lectivo) => {
  try {
    const [rows] = await pool.execute(
      QUERY_ALUMNOS_POR_CURSO,
      [anio_curso, division, anio_lectivo]
    );

    if (rows.length === 0) {
      throw new Error(
        `No se encontraron alumnos activos en el curso ${anio_curso} "${division}" para el año lectivo ${anio_lectivo}`
      );
    }

    return rows.map((row) => ({
      id: row.id_alumno, dni: row.dni_alumno, nombre: row.nombre_alumno, apellido: row.apellido_alumno, email: row.email,
      curso: { id: row.id_curso, nombre: row.nombre_curso, division: row.division, turno: row.turno, anio_curso: row.anio_curso, },
    }));
  } catch (error) {
    console.error("❌ Error al obtener alumnos por curso:", error);
    throw error;
  }
};

const obtenerAlumnosPorCursosMultiples = async (cursos) => {
    try {
        const params = [];
        const whereClauses = [];
        
        const baseQuery = `
            SELECT DISTINCT
                a.id_alumno, a.dni_alumno, a.nombre_alumno, a.apellido_alumno, a.email,
                c.id_curso, c.nombre AS nombre_curso, c.division, c.turno, c.anio AS anio_curso
            FROM alumno a
            JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
            JOIN curso c ON ac.id_curso = c.id_curso
            WHERE a.estado = 'activo' AND (
        `;
        
        cursos.forEach((curso) => {
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
        
        if (rows.length === 0) {
            throw new Error(`No se encontraron alumnos activos en los cursos seleccionados.`);
        }

        return rows.map(row => ({
            id: row.id_alumno, dni: row.dni_alumno, nombre: row.nombre_alumno, apellido: row.apellido_alumno, email: row.email,
            curso: { id: row.id_curso, nombre: row.nombre_curso, division: row.division, turno: row.turno, anio: row.anio_curso }
        }));
    } catch (error) {
        console.error('❌ Error al obtener alumnos por cursos múltiples:', error);
        throw error;
    }
};

const enviarAlertaAsistenciaPorCurso = async (anio_curso, division, anio_lectivo, faltasMaximas = 20, id_usuario = 0) => {
  try {
    console.log(`📧 Iniciando envío masivo al curso ${anio_curso} "${division}" - Año Lectivo ${anio_lectivo}...`);

    const alumnos = await obtenerAlumnosPorCurso(anio_curso, division, anio_lectivo);
    const dnis = alumnos.map((alumno) => alumno.dni);

    console.log(`👥 Alumnos encontrados: ${alumnos.length}`);

    // Propaga id_usuario a la función masiva
    const resultado = await enviarAlertaAsistenciaMasiva(dnis, anio_lectivo, faltasMaximas, id_usuario);

    return { curso: alumnos.length > 0 ? alumnos[0].curso : { anio_curso, division }, totalAlumnos: alumnos.length, ...resultado, };
  } catch (error) {
    console.error("❌ Error al enviar alerta por curso:", error);
    throw error;
  }
};

const enviarNotificacionReunionPorCurso = async (anio_curso, division, anio_lectivo, reunionData, id_usuario = 0) => {
  try {
    console.log(`📧 Iniciando envío de reunión al curso ${anio_curso} "${division}" - Año Lectivo ${anio_lectivo}...`);

    const alumnos = await obtenerAlumnosPorCurso(anio_curso, division, anio_lectivo);
    const dnis = alumnos.map((alumno) => alumno.dni);

    console.log(`👥 Alumnos encontrados: ${alumnos.length}`);

    // Propaga id_usuario a la función masiva
    const resultado = await enviarNotificacionReunionMasiva(dnis, anio_lectivo, reunionData, id_usuario);

    return { curso: alumnos.length > 0 ? alumnos[0].curso : { anio_curso, division }, totalAlumnos: alumnos.length, ...resultado, };
  } catch (error) {
    console.error("❌ Error al enviar reunión por curso:", error);
    throw error;
  }
};

const enviarNotificacionGeneralPorCurso = async (anio_curso, division, anio_lectivo, notificacionData, id_usuario = 0) => {
  try {
    console.log(`📧 Iniciando envío de notificación al curso ${anio_curso} "${division}" - Año Lectivo ${anio_lectivo}...`);

    const alumnos = await obtenerAlumnosPorCurso(anio_curso, division, anio_lectivo);
    const dnis = alumnos.map((alumno) => alumno.dni);

    console.log(`👥 Alumnos encontrados: ${alumnos.length}`);

    // Propaga id_usuario a la función masiva
    const resultado = await enviarNotificacionGeneralMasiva(dnis, anio_lectivo, notificacionData, id_usuario);

    return { curso: alumnos.length > 0 ? alumnos[0].curso : { anio_curso, division }, totalAlumnos: alumnos.length, ...resultado, };
  } catch (error) {
    console.error("❌ Error al enviar notificación por curso:", error);
    throw error;
  }
};

const enviarNotificacionGeneralPorCursosMultiples = async (cursos, notificacionData, id_usuario = 0) => {
  try {
    console.log(`📧 Iniciando envío a ${cursos.length} cursos...`); 
    const alumnos = await obtenerAlumnosPorCursosMultiples(cursos);
    const dnis = alumnos.map((alumno) => alumno.dni);
    console.log(`👥 Alumnos encontrados: ${alumnos.length}`); 

    const anioReferencia = cursos[0]?.anio_lectivo || new Date().getFullYear();
    
    // Propaga id_usuario a la función masiva
    const resultado = await enviarNotificacionGeneralMasiva(dnis, anioReferencia, notificacionData, id_usuario); 
    
    const alumnosPorCurso = alumnos.reduce((acc, alumno) => {
      const cursoKey = `${alumno.curso.anio}/${alumno.curso.division}/${alumno.curso.id}`;
      if (!acc[cursoKey]) { acc[cursoKey] = { curso: alumno.curso, cantidad: 0, }; }
      acc[cursoKey].cantidad++;
      return acc;
    }, {});
    return { cursos_enviados: Object.values(alumnosPorCurso), totalAlumnos: alumnos.length, totalCursos: cursos.length, ...resultado, };
  } catch (error) {
    console.error("❌ Error al enviar notificación a múltiples cursos:", error);
    throw error;
  }
};

// ===============================================
// EXPORTACIONES FINALES
// ===============================================

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
  // Funciones por curso
  obtenerCursosDisponibles,
  obtenerAlumnosPorCurso, 
  obtenerAlumnosPorCursosMultiples, 
  enviarAlertaAsistenciaPorCurso, 
  enviarNotificacionReunionPorCurso, 
  enviarNotificacionGeneralPorCurso, 
  enviarNotificacionGeneralPorCursosMultiples,
};