const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-app-peluqueria.vercel.app', 'https://peluqueria-turnos.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar base de datos
const db = new sqlite3.Database('./peluqueria.db');

// Crear tablas
db.serialize(() => {
  // Tabla de usuarios (admin y clientes)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de servicios
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT 1
  )`);

  // Tabla de turnos
  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users (id),
    FOREIGN KEY (service_id) REFERENCES services (id)
  )`);

  // Insertar admin por defecto
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (name, email, password, role) 
          VALUES ('Admin', 'admin@peluqueria.com', ?, 'admin')`, [adminPassword]);

  // Insertar servicios por defecto
  db.run(`INSERT OR IGNORE INTO services (name, duration, price, description) VALUES 
    ('Corte de Cabello', 30, 15.00, 'Corte básico de cabello'),
    ('Corte + Barba', 45, 25.00, 'Corte de cabello y arreglo de barba'),
    ('Solo Barba', 20, 12.00, 'Arreglo y perfilado de barba'),
    ('Lavado + Corte', 40, 20.00, 'Lavado y corte de cabello')`);
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

app.post('/api/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)',
    [name, email, phone, hashedPassword],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'El email ya está registrado' });
        }
        return res.status(500).json({ error: 'Error del servidor' });
      }

      const token = jwt.sign(
        { id: this.lastID, email, role: 'client' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: this.lastID,
          name,
          email,
          role: 'client'
        }
      });
    }
  );
});

// Rutas de servicios
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services WHERE active = 1', (err, services) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(services);
  });
});

// Rutas de turnos
app.get('/api/appointments', authenticateToken, (req, res) => {
  let query = `
    SELECT a.*, u.name as client_name, u.phone as client_phone, 
           s.name as service_name, s.duration, s.price
    FROM appointments a
    JOIN users u ON a.client_id = u.id
    JOIN services s ON a.service_id = s.id
  `;
  
  const params = [];
  
  if (req.user.role === 'client') {
    query += ' WHERE a.client_id = ?';
    params.push(req.user.id);
  }
  
  query += ' ORDER BY a.date, a.time';

  db.all(query, params, (err, appointments) => {
    if (err) {
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(appointments);
  });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const { service_id, date, time, notes } = req.body;
  const client_id = req.user.id;

  // Verificar disponibilidad
  db.get(
    'SELECT * FROM appointments WHERE date = ? AND time = ? AND status != "cancelled"',
    [date, time],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (existing) {
        return res.status(400).json({ error: 'Horario no disponible' });
      }

      db.run(
        'INSERT INTO appointments (client_id, service_id, date, time, notes) VALUES (?, ?, ?, ?, ?)',
        [client_id, service_id, date, time, notes],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error del servidor' });
          }

          res.status(201).json({
            id: this.lastID,
            message: 'Turno creado exitosamente'
          });
        }
      );
    }
  );
});

app.put('/api/appointments/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const appointmentId = req.params.id;

  db.run(
    'UPDATE appointments SET status = ? WHERE id = ?',
    [status, appointmentId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Turno no encontrado' });
      }

      res.json({ message: 'Estado actualizado' });
    }
  );
});

// Obtener horarios disponibles
app.get('/api/available-slots/:date', (req, res) => {
  const date = req.params.date;
  const workingHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                       '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  db.all(
    'SELECT time FROM appointments WHERE date = ? AND status != "cancelled"',
    [date],
    (err, appointments) => {
      if (err) {
        return res.status(500).json({ error: 'Error del servidor' });
      }

      const bookedTimes = appointments.map(apt => apt.time);
      const availableSlots = workingHours.filter(time => !bookedTimes.includes(time));

      res.json(availableSlots);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});