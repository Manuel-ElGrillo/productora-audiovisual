// Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

// Importar rutas
import bookingRoutes from "../src/05-frameworks/05-3-webservers/routes/bookingRoutes.js"
import serviceRoutes from "../src/05-frameworks/05-3-webservers/routes/serviceRoutes.js"
// import portfolioRoutes from "../src/05-frameworks/05-3-webservers/routes/portfolioRoutes.js" esto no va por ahora

// Crear app Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Rutas CON el prefijo /api/
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
// app.use('/api/portfolio', portfolioRoutes);

// Health check CON /api/
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Servidor de la productora funcionando ✅'
  });
});

// Catch-all para ver qué rutas llegan
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada`,
    debug: {
      receivedUrl: req.url,
      receivedPath: req.path,
      receivedOriginalUrl: req.originalUrl,
      receivedMethod: req.method,
      availableRoutes: [
        'GET /api/health',
        'GET /api/services',
        'POST /api/services', 
        'GET /api/bookings',
        'POST /api/bookings'
      ]
    }
  });
});

// Conexión a MongoDB (reutilizable)
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error MongoDB:', error.message);
    throw error;
  }
}

// Handler para Vercel
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}