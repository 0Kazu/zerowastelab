// src/controllers/examController.js
const pool = require('../config/db');

// 1. Obtener catálogo para el dropdown del admin
const obtenerCatalogo = async (req, res) => {
    try {
        const [catalogo] = await pool.query('SELECT * FROM catalogo_examenes');
        res.json(catalogo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el catálogo' });
    }
};

// 2. Obtener todos los pacientes y sus exámenes (Para el Panel Admin)
const obtenerPacientes = async (req, res) => {
    try {
        // Buscamos solo a los usuarios con rol 'paciente'
        const [pacientes] = await pool.query('SELECT id, nombre, correo FROM usuarios WHERE rol = ?', ['paciente']);

        // Por cada paciente, buscamos sus exámenes asignados
        for (let paciente of pacientes) {
            const [examenes] = await pool.query(`
                SELECT ea.id as asignacion_id, ce.nombre, ea.estado, ce.id as examen_id
                FROM examenes_asignados ea
                JOIN catalogo_examenes ce ON ea.examen_id = ce.id
                WHERE ea.usuario_id = ?
            `, [paciente.id]);
            
            // Le agregamos el arreglo de exámenes al objeto del paciente
            paciente.examenes = examenes;
        }

        res.json(pacientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener pacientes' });
    }
};

// 3. Asignar un examen a un paciente (Admin)
const asignarExamen = async (req, res) => {
    const { usuario_id, examen_id } = req.body;
    try {
        // Usamos comillas simples para 'pendiente'
        const [existe] = await pool.query(
            "SELECT id FROM examenes_asignados WHERE usuario_id = ? AND examen_id = ? AND estado = 'pendiente'",
            [usuario_id, examen_id]
        );

        if (existe.length > 0) {
            return res.status(400).json({ mensaje: 'Este paciente ya tiene este examen pendiente.' });
        }

        await pool.query(
            "INSERT INTO examenes_asignados (usuario_id, examen_id, estado) VALUES (?, ?, 'pendiente')",
            [usuario_id, examen_id]
        );
        res.status(201).json({ mensaje: 'Examen asignado correctamente' });
    } catch (error) {
        console.error('Error al asignar:', error);
        res.status(500).json({ mensaje: 'Error al asignar examen' });
    }
};

// 4. Cambiar el estado de un examen (Admin: pendiente <-> listo)
const cambiarEstado = async (req, res) => {
    const { asignacion_id, estado_actual } = req.body;
    const nuevo_estado = estado_actual === 'pendiente' ? 'listo' : 'pendiente';

    try {
        await pool.query(
            'UPDATE examenes_asignados SET estado = ? WHERE id = ?',
            [nuevo_estado, asignacion_id]
        );
        res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar estado' });
    }
};

// 5. Obtener los exámenes de un paciente (Para su propio panel)
const obtenerMisExamenes = async (req, res) => {
    const { correo } = req.params; 
    try {
        const [examenes] = await pool.query(`
            SELECT ce.nombre, ea.estado
            FROM examenes_asignados ea
            JOIN catalogo_examenes ce ON ea.examen_id = ce.id
            JOIN usuarios u ON ea.usuario_id = u.id
            WHERE u.correo = ?
        `, [correo]);
        res.json(examenes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tus exámenes' });
    }
};

module.exports = { 
    obtenerCatalogo, 
    obtenerPacientes, 
    asignarExamen, 
    cambiarEstado, 
    obtenerMisExamenes 
};