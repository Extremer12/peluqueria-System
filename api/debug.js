export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    platform: 'Vercel Serverless',
    nodeVersion: process.version,
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