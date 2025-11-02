const jwt = require('jsonwebtoken');
const { enviarRecuperacionPassword } = require('../../services/emails.service');
const { connection } = require('../../config/db');
const dotenv = require('dotenv');
dotenv.config();

// Solicitar reset de contraseña (envía email)
const solicitarReset = (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM Usuarios WHERE mail = ?';
    
    connection.query(query, [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        const token = jwt.sign(
            { id: user.id, mail: user.mail }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );
        
        const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        
        await enviarRecuperacionPassword(user.mail, link);
        
        return res.status(200).json({ message: "Email de recuperación enviado" });
    });
};

// Validar token (cuando usuario hace clic en el link)
const validarToken = (req, res) => {
    const { token } = req.params;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ 
            valid: true, 
            message: "Token válido",
            email: decoded.mail 
        });
    } catch (error) {
        return res.status(401).json({ 
            valid: false, 
            message: "Token inválido o expirado" 
        });
    }
};

// Cambiar contraseña
const cambiarPassword = (req, res) => {
    const { token, newPassword } = req.body;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: "Error al encriptar contraseña" });
            }
            
            const query = 'UPDATE Usuarios SET password = ? WHERE mail = ?';
            connection.query(query, [hash, decoded.mail], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: "Error al actualizar contraseña" });
                }
                
                return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
            });
        });
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

module.exports = { 
    solicitarReset, 
    validarToken, 
    cambiarPassword 
};