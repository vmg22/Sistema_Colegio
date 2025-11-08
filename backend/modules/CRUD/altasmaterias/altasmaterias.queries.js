/**
* Consultas SQL para el módulo de Materias
*/
const consultasMaterias = {
// Obtener todas las materias activas
obtenerTodos: `
SELECT * FROM materia
WHERE deleted_at IS NULL
-- La lógica de BÚSQUEDA y ORDEN se añade en el service
`,

// Obtener una materia por ID
obtenerPorId: `
SELECT * FROM materia 
WHERE id_materia = ? AND deleted_at IS NULL
`,

// Crear una nueva materia
crear: `
INSERT INTO materia 
(nombre, descripcion, carga_horaria, nivel, ciclo, estado)
VALUES (?, ?, ?, ?, ?, ?)
`,

// Actualizar una materia completa
actualizarCompleto: `
UPDATE materia
SET 
nombre = ?, 
descripcion = ?, 
carga_horaria = ?, 
nivel = ?, 
ciclo = ?, 
estado = ?, 
updated_at = CURRENT_TIMESTAMP
WHERE id_materia = ? AND deleted_at IS NULL
`,

// --- CORREGIDO ---
// Eliminar lógicamente una materia
eliminarLogico: `
UPDATE materia 
SET 
deleted_at = CURRENT_TIMESTAMP,
estado = 'inactiva' -- Añadido para consistencia
WHERE id_materia = ? AND deleted_at IS NULL
`,

// Obtener materias eliminadas
obtenerEliminados: `
SELECT * FROM materia
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at DESC
`,

// --- CORREGIDO ---
// Restaurar una materia eliminada
restaurar: `
UPDATE materia 
SET 
deleted_at = NULL,
estado = 'activa' -- Añadido para consistencia
WHERE id_materia = ? AND deleted_at IS NOT NULL
`,

// Verificar si ya existe una materia con ese nombre y nivel
verificarExiste: `
SELECT id_materia FROM materia
WHERE nombre = ? AND nivel = ? AND deleted_at IS NULL
`,

// Obtener valores del ENUM 'ciclo'
obtenerValoresEnumCiclo: `
SHOW COLUMNS FROM materia LIKE 'ciclo'
`,

// Obtener valores del ENUM 'estado'
obtenerValoresEnumEstado: `
SHOW COLUMNS FROM materia LIKE 'estado'
`
};

module.exports = consultasMaterias;
