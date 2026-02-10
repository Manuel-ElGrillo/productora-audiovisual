import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Datos del cliente
    client: {
      fullName: {
        type: String,
        required: [true, 'El nombre del cliente es obligatorio']
      },
      email: {
        type: String,
        required: [true, 'El email del cliente es obligatorio']
      },
      phone: {
        type: String,
        required: [true, 'El teléfono del cliente es obligatorio']
      }
    },

    // Datos del servicio
    service: {
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
      }
    },

    // Datos de la reserva
    bookingDate: {
      type: String,   // 'YYYY-MM-DD'
      required: [true, 'La fecha de reserva es obligatoria']
    },
    bookingTime: {
      type: String,   // 'HH:MM'
      required: [true, 'La hora de reserva es obligatoria']
    },
    dateTime: {
      type: Date,     // Fecha y hora combinadas para búsquedas
      required: true
    },
    state: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'pendiente'
    }
  },
  {
    // Agrega automáticamente createdAt y updatedAt
    timestamps: true
  }
);

const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;