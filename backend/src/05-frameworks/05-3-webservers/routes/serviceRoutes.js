// Como crear un servicio es solo guardar en BD,
// no necesitamos todo el caso de uso completo.
// ============================================

import { Router } from 'express';
import MongoServiceRepository from '../../database/05-2-repositories/MongoServiceRepository.js';
import Service from '../../../01-entities/Service.js';

const router = Router();
const serviceRepository = new MongoServiceRepository();

// GET /api/services - Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const services = await serviceRepository.findAll();
    res.status(200).json({
      status: 'success',
      data: services
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /api/services/:id - Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const service = await serviceRepository.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: service
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST /api/services - Crear un nuevo servicio
router.post('/', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Usamos la Entity Service para validar las reglas de negocio
    const service = new Service(name, description, price);

    // Guardamos en MongoDB
    const serviceData = {
      name: service.name,
      description: service.description,
      price: service.price,
      isActive: true
    };

    const savedService = await serviceRepository.save(serviceData);

    res.status(201).json({
      status: 'success',
      message: 'Servicio creado exitosamente',
      data: savedService
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;