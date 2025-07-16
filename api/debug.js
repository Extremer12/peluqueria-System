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
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    platform: 'Vercel Serverless',
    nodeVersion: process.version,
    region: process.env.VERCEL_REGION || 'unknown',
    endpoints: [
      '/api/health',
      '/api/debug',
      '/api/login',
      '/api/register',
      '/api/services',
      '/api/appointments'
    ]
  });
}