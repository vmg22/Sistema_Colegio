//roles,estados,tipos de usuario y demas constantes

// ====================
// ROLES DE USUARIO
// ====================

const ROLES_USUARIO = {
  ADMIN: 'admin',
  DOCENTE: 'docente',
  PRECEPTOR: 'preceptor',
  SECRETARIO: 'secretario',
  TUTOR: 'tutor'
};

// ====================
// ESTADOS GENERALES
// ====================

const ESTADOS_USUARIO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  PENDIENTE: 'pendiente'
};

const ESTADOS_ALUMNO = {
  ACTIVO: 'activo',
  EGRESADO: 'egresado',
  BAJA: 'baja',
  SUSPENDIDO: 'suspendido'
};

const ESTADOS_DOCENTE = {
  ACTIVO: 'activo',
  LICENCIA: 'licencia',
  INACTIVO: 'inactivo'
};

const ESTADOS_TUTOR = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
};

const ESTADOS_CURSO = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  COMPLETADO: 'completado'
};

const ESTADOS_MATERIA = {
  ACTIVA: 'activa',
  INACTIVA: 'inactiva'
};

// ====================
// AÑOS LECTIVOS
// ====================

const ESTADOS_ANIO_LECTIVO = {
  PLANIFICACION: 'planificacion',
  ACTIVO: 'activo',
  FINALIZADO: 'finalizado'
};

// ====================
// PARENTESCOS DE TUTORES
// ====================

const PARENTESCOS_TUTOR = {
  PADRE: 'padre',
  MADRE: 'madre',
  TUTOR_LEGAL: 'tutor legal',
  ABUELO: 'abuelo/a',
  OTRO: 'otro'
};

// ====================
// TURNOS ESCOLARES
// ====================

const TURNOS_CURSO = {
  MAÑANA: 'mañana',
  TARDE: 'tarde',
  NOCHE: 'noche'
};

// ====================
// CICLOS EDUCATIVOS
// ====================

const CICLOS_MATERIA = {
  BASICO: 'basico',
  SUPERIOR: 'superior'
};

// ====================
// ESTADOS DE MATRICULACIÓN
// ====================

const ESTADOS_MATRICULACION = {
  REGULAR: 'regular',
  LIBRE: 'libre',
  CONDICIONAL: 'condicional'
};

// ====================
// ESTADOS DE MATERIAS POR ALUMNO
// ====================

const ESTADOS_MATERIA_ALUMNO = {
  CURSANDO: 'cursando',
  APROBADA: 'aprobada',
  DESAPROBADA: 'desaprobada',
  LIBRE: 'libre',
  PREVIA: 'previa'
};

// ====================
// TIPOS DE CORRELATIVIDAD
// ====================

const TIPOS_CORRELATIVA = {
  OBLIGATORIA: 'obligatoria',
  RECOMENDADA: 'recomendada'
};

// ====================
// CUATRIMESTRES
// ====================

const CUATRIMESTRES = {
  PRIMERO: '1',
  SEGUNDO: '2'
};

// ====================
// ESTADOS DE CALIFICACIÓN
// ====================

const ESTADOS_CALIFICACION = {
  CURSANDO: 'cursando',
  APROBADA: 'aprobada',
  DESAPROBADA: 'desaprobada',
  LIBRE: 'libre'
};

// ====================
// TIPOS DE DESTINATARIOS COMUNICACIONES
// ====================

const TIPOS_DESTINATARIO = {
  ALUMNO: 'alumno',
  DOCENTE: 'docente',
  CURSO: 'curso',
  TUTOR: 'tutor',
  TODOS: 'todos'
};

// ====================
// AÑOS ESCOLARES (GRADOS)
// ====================

const AÑOS_ESCOLARES = {
  PRIMERO: 1,
  SEGUNDO: 2,
  TERCERO: 3,
  CUARTO: 4,
  QUINTO: 5,
  SEXTO: 6
};

// ====================
// DIVISIONES DE CURSOS
// ====================

const DIVISIONES_CURSO = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F'
};

// ====================
// ESPECIALIDADES DOCENTES
// ====================

const ESPECIALIDADES_DOCENTE = {
  MATEMATICA: 'Matemática',
  LENGUA: 'Lengua y Literatura',
  INGLES: 'Inglés',
  HISTORIA: 'Historia',
  GEOGRAFIA: 'Geografía',
  BIOLOGIA: 'Biología',
  FISICA: 'Física',
  QUIMICA: 'Química',
  EDUCACION_FISICA: 'Educación Física',
  ARTISTICA: 'Educación Artística',
  TECNOLOGIA: 'Tecnología',
  INFORMATICA: 'Informática',
  FILOSOFIA: 'Filosofía',
  PSICOLOGIA: 'Psicología',
  ECONOMIA: 'Economía',
  DERECHO: 'Derecho'
};

// ====================
// MATERIAS COMUNES POR NIVEL
// ====================

const MATERIAS_BASICAS = {
  PRIMERO: [
    'Matemática 1°',
    'Lengua y Literatura 1°',
    'Ciencias Naturales 1°',
    'Ciencias Sociales 1°',
    'Inglés 1°',
    'Educación Física 1°',
    'Educación Artística 1°'
  ],
  SEGUNDO: [
    'Matemática 2°',
    'Lengua y Literatura 2°',
    'Ciencias Naturales 2°',
    'Ciencias Sociales 2°',
    'Inglés 2°',
    'Educación Física 2°',
    'Educación Artística 2°'
  ],
  TERCERO: [
    'Matemática 3°',
    'Lengua y Literatura 3°',
    'Biología 3°',
    'Historia 3°',
    'Geografía 3°',
    'Inglés 3°',
    'Educación Física 3°',
    'Educación Tecnológica 3°'
  ]
};

// ====================
// CONFIGURACIÓN ACADÉMICA
// ====================

const CONFIGURACION_ACADEMICA = {
  NOTA_MINIMA: 0,
  NOTA_MAXIMA: 10,
  NOTA_APROBACION: 6,
  PROMEDIO_MINIMO_PROMOCION: 7,
  CANTIDAD_MAXIMA_INASISTENCIAS: 25, // Porcentaje
  CARGA_HORARIA_SEMANAL_MINIMA: 20,
  CARGA_HORARIA_SEMANAL_MAXIMA: 36
};

// ====================
// PERÍODOS ACADÉMICOS
// ====================

const PERIODOS_ACADEMICOS = {
  PRIMER_CUATRIMESTRE: {
    nombre: 'Primer Cuatrimestre',
    meses: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio']
  },
  SEGUNDO_CUATRIMESTRE: {
    nombre: 'Segundo Cuatrimestre',
    meses: ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  }
};

// ====================
// MESES DEL AÑO LECTIVO
// ====================

const MESES_LECTIVOS = [
  'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ====================
// TIPOS DE DOCUMENTOS
// ====================

const TIPOS_DOCUMENTO = {
  DNI: 'DNI',
  PASAPORTE: 'Pasaporte',
  CEDULA: 'Cédula',
  LC: 'LC', // Libreta Cívica
  LE: 'LE'  // Libreta de Enrolamiento
};

// ====================
// ESTADOS DE ASISTENCIA
// ====================

const ESTADOS_ASISTENCIA = {
  PRESENTE: 'presente',
  AUSENTE: 'ausente',
  JUSTIFICADO: 'justificado',
  TARDANZA: 'tardanza'
};

// ====================
// TIPOS DE EVENTOS ESCOLARES
// ====================

const TIPOS_EVENTO = {
  ACADEMICO: 'académico',
  ADMINISTRATIVO: 'administrativo',
  CULTURAL: 'cultural',
  DEPORTIVO: 'deportivo',
  RECREATIVO: 'recreativo',
  EVALUACION: 'evaluación'
};

// ====================
// EXPORTACIÓN DE TODAS LAS CONSTANTES
// ====================

module.exports = {
  // Roles y Estados
  ROLES_USUARIO,
  ESTADOS_USUARIO,
  ESTADOS_ALUMNO,
  ESTADOS_DOCENTE,
  ESTADOS_TUTOR,
  ESTADOS_CURSO,
  ESTADOS_MATERIA,
  
  // Años Lectivos
  ESTADOS_ANIO_LECTIVO,
  
  // Familia y Tutores
  PARENTESCOS_TUTOR,
  
  // Configuración Académica
  TURNOS_CURSO,
  CICLOS_MATERIA,
  ESTADOS_MATRICULACION,
  ESTADOS_MATERIA_ALUMNO,
  TIPOS_CORRELATIVA,
  CUATRIMESTRES,
  ESTADOS_CALIFICACION,
  
  // Comunicaciones
  TIPOS_DESTINATARIO,
  
  // Estructura Escolar
  AÑOS_ESCOLARES,
  DIVISIONES_CURSO,
  ESPECIALIDADES_DOCENTE,
  MATERIAS_BASICAS,
  
  // Configuración
  CONFIGURACION_ACADEMICA,
  PERIODOS_ACADEMICOS,
  MESES_LECTIVOS,
  TIPOS_DOCUMENTO,
  ESTADOS_ASISTENCIA,
  TIPOS_EVENTO
};