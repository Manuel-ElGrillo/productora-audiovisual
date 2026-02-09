 // Define qué operaciones DEBE tener quien guarde/busque reservas:
// - save(): guardar una reserva
// - findByDateTime(): buscar reservas en una fecha/hora específica
// - findAll(): obtener todas las reservas
// El Repository (MongoDB) implementará este contrato.
// ============================================

class BookingGateway {
  /**
   * Guarda una reserva en la base de datos
   * @param {Booking} booking - La reserva a guardar
   * @returns {Promise<Booking>} La reserva guardada
   */
  async save(booking) {
    throw new Error('Este método debe ser implementado por el Repository');
  }

  /**
   * Busca reservas en una fecha y hora específica
   * @param {Date} dateTime - Fecha y hora a buscar
   * @returns {Promise<Array<Booking>>} Array de reservas en esa fecha/hora
   */
  async findByDateTime(dateTime) {
    throw new Error('Este método debe ser implementado por el Repository');
  }

  /**
   * Obtiene todas las reservas
   * @returns {Promise<Array<Booking>>} Array con todas las reservas
   */
  async findAll() {
    throw new Error('Este método debe ser implementado por el Repository');
  }
}

export default BookingGateway;