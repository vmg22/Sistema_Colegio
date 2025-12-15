const fs = require('fs');

const filePath = 'c:\\Users\\Matias\\OneDrive\\Desktop\\PPS\\PROYECTO\\Sistema_Colegio\\backend\\services\\emails.service.js';

let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Encontrar y reemplazar las líneas 2041-2045 (índice 2040-2044)
if (lines[2040] && lines[2040].includes('if (rows.length === 0)')) {
  console.log('✅ Encontrado en línea 2041');
  console.log('Línea 2041:', lines[2040]);
  console.log('Línea 2042:', lines[2041]);
  console.log('Línea 2043:', lines[2042]);
  console.log('Línea 2044:', lines[2043]);
  console.log('Línea 2045:', lines[2044]);
  
  // Reemplazar las 5 líneas
  lines[2040] =  '    if (rows.length === 0) {';
  lines[2041] = '      console.warn(`⚠️ Curso ${anio_curso}"${division}" (${anio_lectivo}): sin alumnos activos`);';
  lines[2042] = '      return []; // Retornar vacío en lugar de error';
  lines[2043] = '    }';
  lines[2044] = '';
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('\n✅ Archivo modificado exitosamente');
} else {
  console.log('❌ No se encontró el patrón esperado en línea 2041');
  console.log('Contenido real:', lines[2040]);
}
