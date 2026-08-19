// src/routes/examRoutes.js
const express = require('express');
const router = express.Router();
const { 
    obtenerCatalogo, 
    obtenerPacientes, 
    asignarExamen, 
    cambiarEstado, 
    obtenerMisExamenes,
    eliminarExamen
} = require('../controllers/examController');

// Rutas de administración
router.get('/catalogo', obtenerCatalogo);
router.get('/pacientes', obtenerPacientes);
router.post('/asignar', asignarExamen);
router.put('/estado', cambiarEstado);
router.delete('/asignacion/:id', eliminarExamen);

// Rutas de pacientes (Usamos el correo en la URL para buscar)
router.get('/mis-examenes/:correo', obtenerMisExamenes);

module.exports = router;