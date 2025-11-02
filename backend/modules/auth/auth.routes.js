const { Router } = require('express');
const router = Router();
const { solicitarReset, validarToken, cambiarPassword } = require('../controllers/auth.controller');


router.post('/solicitar-reset', solicitarReset);// Ruta para solicitar reseteo de contraseña (envía email)
router.get('/validar-token/:token', validarToken);// Ruta para validar el token (cuando el usuario hace clic en el link del email)
router.post('/cambiar-password', cambiarPassword);// Ruta para cambiar la contraseña

module.exports = router;