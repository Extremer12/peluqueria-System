export default function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({ 
    message: 'Peluquería API Server - Vercel Serverless',
    status: 'running',
    timestamp: new Date().toISOString(),
    platform: 'Vercel',
    endpoints: {
      health: '/api/health',
      debug: '/api/debug',
      services: '/api/services',
      login: '/api/login (POST)',
      register: '/api/register (POST)'
    }
  });
}