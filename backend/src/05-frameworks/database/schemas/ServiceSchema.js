import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio']
    },
    description: {
      type: String,
      required: [true, 'La descripción del servicio es obligatoria']
    },
    price: {
      type: Number,
      required: [true, 'El precio del servicio es obligatorio']
    },
    isActive: {
      type: Boolean,
      default: true   // Para poder desactivar servicios sin borrarlos
    }
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model('Service', serviceSchema);

export default ServiceModel;