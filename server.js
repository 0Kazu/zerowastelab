// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Inicializamos la aplicación de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Importamos la conexión a la base de datos (solo para que se ejecute la prueba de conexión)
require('./src/config/db');

// ==========================================
// MIDDLEWARES (Configuraciones previas)
// ==========================================
app.use(cors()); // Permite peticiones desde otros dominios
app.use(express.json()); // Permite que el servidor entienda datos en formato JSON

// Le decimos a Express que la carpeta "public" contiene archivos estáticos (como tu HTML)
// Así, al entrar a http://localhost:3000, automáticamente cargará public/index.html
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// RUTAS (Nuestra API) - Las crearemos en el siguiente paso
// ==========================================
const authRoutes = require('./src/routes/authRoutes');
const examRoutes = require('./src/routes/examRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/examenes', examRoutes);

// Ruta de prueba para verificar que la API responde
app.get('/api/ping', (req, res) => {
    res.json({ mensaje: '¡El servidor backend está funcionando perfectamente! 🚀' });
});

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🌐 Tu página web está disponible en http://localhost:${PORT}`);
});