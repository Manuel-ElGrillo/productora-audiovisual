import mongoose from 'mongoose';
import ServiceGateway from '../../../02-boundaries/02-3-gateways/ServiceGateway.js';
import ServiceModel from '../schemas/ServiceSchema.js';

class MongoServiceRepository extends ServiceGateway {
  async findById(serviceId) {

    if(!mongoose.Types.ObjectId.isValid(serviceId)){
        throw new Error('El ID del servicio no es válido');
    }

    const service = await ServiceModel.findById(serviceId);

    if (!service) {
      throw new Error('El servicio solicitado no existe');
    }

    return service;
  }

  async findAll() {
    return await ServiceModel.find({ isActive: true });
  }

  async save(serviceData){
    const savedService = await ServiceModel.create(serviceData);
    return savedService;
  }
}

export default MongoServiceRepository;