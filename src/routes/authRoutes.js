// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/authController');

// Cuando el HTML haga un POST a /api/auth/registro, se ejecuta registrarUsuario
router.post('/registro', registrarUsuario);

// Cuando el HTML haga un POST a /api/auth/login, se ejecuta loginUsuario
router.post('/login', loginUsuario);

module.exports = router;