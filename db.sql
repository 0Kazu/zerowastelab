-- 2. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'paciente') DEFAULT 'paciente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear tabla de exámenes (el catálogo)
CREATE TABLE IF NOT EXISTS catalogo_examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Insertar los exámenes de tu catálogo actual
INSERT INTO catalogo_examenes (nombre) VALUES 
('Química Sanguínea de 6 elementos'),
('Biometría Hemática'),
('Examen General de Orina'),
('Perfil Tiroideo'),
('Prueba de Embarazo en Sangre'),
('Perfil de Lípidos'),
('Hemoglobina Glicosilada')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 5. Crear tabla de exámenes asignados a pacientes
CREATE TABLE IF NOT EXISTS examenes_asignados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    examen_id INT NOT NULL,
    estado ENUM('pendiente', 'listo') DEFAULT 'pendiente',
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (examen_id) REFERENCES catalogo_examenes(id) ON DELETE CASCADE
);

-- 6. Insertar el usuario administrador por defecto
INSERT INTO usuarios (nombre, correo, password, rol) 
VALUES ('Admin General', 'admin@zerowastelab.com', 'admin', 'admin')
ON DUPLICATE KEY UPDATE correo=correo;