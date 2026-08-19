// src/controllers/authController.js
const pool = require('../config/db');

const registrarUsuario = async (req, res) => {
    const { nombre, correo, password } = req.body;

    try {
        // 1. Verificar si el correo ya está registrado
        const [usuariosExistentes] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe una cuenta con este correo.' });
        }

        // 2. Insertar el nuevo usuario en la base de datos
        // Nota: En un proyecto para producción real, la contraseña debe encriptarse aquí (ej. usando bcrypt)
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', 
            [nombre, correo, password, 'paciente']
        );

        // 3. Devolver los datos del usuario recién creado
        res.status(201).json({ 
            id: resultado.insertId, 
            nombre, 
            correo, 
            rol: 'paciente' 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

const loginUsuario = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscar al usuario por correo y contraseña
        const [usuarios] = await pool.query(
            'SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND password = ?', 
            [correo, password]
        );

        // 2. Si no hay coincidencias, credenciales inválidas
        if (usuarios.length === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
        }

        // 3. Si todo está bien, devolvemos los datos del usuario
        const usuario = usuarios[0];
        res.json(usuario);

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = { registrarUsuario, loginUsuario };