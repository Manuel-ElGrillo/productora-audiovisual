import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';

const createApp = () => {
  const app = express();

  app.use(express.json());

  // Permite peticiones desde el frontend (Astro)
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));

  app.use('/api/bookings', bookingRoutes);

  // Ruta de health check (para saber si el servidor está vivo)
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Servidor de la productora funcionando ✅'
    });
  });

  // Ruta no encontrada (404)
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Ruta ${req.originalUrl} no encontrada`
    });
  });

  return app;
};

export default createApp;