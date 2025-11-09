// modules/CRUD/tutores/tutor.queries.js
const consultasTutores = {
// Obtener todos los tutores activos
obtenerTodos: `
SELECT 
id_tutor, id_usuario, dni_tutor, nombre, apellido, email,
telefono, direccion, parentesco, estado
FROM tutor
WHERE deleted_at IS NULL
ORDER BY apellido, nombre
`,

// Obtener un tutor por ID
obtenerPorId: `
SELECT * FROM tutor 
WHERE id_tutor = ? AND deleted_at IS NULL
`,

// Crear un nuevo tutor
crear: `
INSERT INTO tutor 
(id_usuario, dni_tutor, nombre, apellido, email, telefono, direccion, parentesco, estado)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

// Actualizar un tutor completo
actualizarCompleto: `
UPDATE tutor
SET 
id_usuario = ?, dni_tutor = ?, nombre = ?, apellido = ?,
email = ?, telefono = ?, direccion = ?, parentesco = ?, estado = ?,
updated_at = CURRENT_TIMESTAMP
WHERE id_tutor = ? AND deleted_at IS NULL
`,

// --- CORREGIDO ---
// Eliminar lógicamente un tutor
eliminarLogico: `
UPDATE tutor 
SET 
deleted_at = CURRENT_TIMESTAMP,
estado = 'inactivo' -- Añadido
WHERE id_tutor = ? AND deleted_at IS NULL
`,

// Obtener tutores eliminados
obtenerEliminados: `
SELECT * FROM tutor
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at DESC
`,

// --- CORREGIDO ---
// Restaurar un tutor eliminado
restaurar: `
UPDATE tutor 
SET 
deleted_at = NULL,
estado = 'activo' -- Añadido
WHERE id_tutor = ? AND deleted_at IS NOT NULL
`,

// --- AÑADIDO ---
// Verificar DNI duplicado
verificarDniExistente: `
SELECT id_tutor FROM tutor
WHERE dni_tutor = ? AND deleted_at IS NULL
`
};

module.exports = consultasTutores;
