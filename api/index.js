export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    message: 'Peluquería API Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      debug: '/api/debug',
      services: '/api/services',
      login: '/api/login (POST)',
      register: '/api/register (POST)'
    }
  });
}