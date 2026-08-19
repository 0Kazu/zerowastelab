// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos el pool de conexiones usando las variables de tu archivo .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // <-- ¡Agrega esta línea!
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hacemos una prueba rápida para verificar que la base de datos responde
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        connection.release(); // Soltamos el "cajero" para que otro lo use
    })
    .catch(err => {
        console.error('❌ Error conectando a la base de datos:', err.message);
    });

module.exports = pool;