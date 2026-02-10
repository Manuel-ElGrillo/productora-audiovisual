import BookingGateway from '../../../02-boundaries/02-3-gateways/BookingGateway.js';
import BookingModel from "../schemas/BookinfSchema.js";

class MongoBookingRepository extends BookingGateway {
  /**
   * Guarda una reserva en MongoDB
   * Implementa el método save() del Gateway
   * 
   * @param {Booking} booking - La entity Booking a guardar
   * @returns {Promise<Object>} La reserva guardada con su ID de MongoDB
   */
  async save(booking) {
    // Convertimos la Entity Booking al formato que MongoDB espera
    const bookingData = {
      client: {
        fullName: booking.client.fullName,
        email: booking.client.email,
        phone: booking.client.phone
      },
      service: {
        name: booking.service.name,
        description: booking.service.description,
        price: booking.service.price
      },
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      dateTime: booking.dateTime,
      state: booking.state
    };

    const savedBooking = await BookingModel.create(bookingData);

    return savedBooking;
  }

  /**
   * Busca reservas en una fecha y hora específica
   * Implementa el método findByDateTime() del Gateway
   * 
   * @param {Date} dateTime - Fecha y hora a buscar
   * @returns {Promise<Array>} Array de reservas en esa fecha/hora
   */
  async findByDateTime(dateTime) {
    const bookings = await BookingModel.find({
      dateTime: dateTime,
      state: { $ne: 'cancelada' }
    });

    return bookings;
  }

  /**
   * Obtiene todas las reservas
   * Implementa el método findAll() del Gateway
   * 
   * @returns {Promise<Array>} Array con todas las reservas
   */
  async findAll() {
    const bookings = await BookingModel.find().sort({ dateTime: 1 });
    return bookings;
  }
}

export default MongoBookingRepository;