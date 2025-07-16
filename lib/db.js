// Database utilities for Vercel serverless functions
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export async function getDatabase() {
  if (!db) {
    // En Vercel, usamos /tmp para archivos temporales
    const dbPath = '/tmp/peluqueria.db';
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Inicializar tablas
    await initializeTables();
  }
  
  return db;
}

async function initializeTables() {
  const bcrypt = await import('bcryptjs');
  
  // Crear tablas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'client',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration INTEGER NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      active BOOLEAN DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS appointments (
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
    );
  `);

  // Insertar datos por defecto
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  try {
    await db.run(
      `INSERT OR IGNORE INTO users (name, email, password, role) 
       VALUES ('Admin', 'admin@peluqueria.com', ?, 'admin')`, 
      [adminPassword]
    );

    await db.run(`
      INSERT OR IGNORE INTO services (name, duration, price, description) VALUES 
      ('Corte de Cabello', 30, 15.00, 'Corte básico de cabello'),
      ('Corte + Barba', 45, 25.00, 'Corte de cabello y arreglo de barba'),
      ('Solo Barba', 20, 12.00, 'Arreglo y perfilado de barba'),
      ('Lavado + Corte', 40, 20.00, 'Lavado y corte de cabello')
    `);
  } catch (error) {
    console.log('Default data already exists or error inserting:', error.message);
  }
}