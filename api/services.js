import { getDatabase } from '../lib/db.js';

export default async function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await getDatabase();
    const services = await db.all('SELECT * FROM services WHERE active = 1');
    res.status(200).json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error del servidor',
      details: error.message 
    });
  }
}