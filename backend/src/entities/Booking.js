class Booking {
  // Estados válidos para una reserva
  static STATES = {
    PENDING: 'pendiente',
    CONFIRMED: 'confirmada',
    CANCELLED: 'cancelada'
  };

  constructor(client, service, bookingDate, bookingTime) {
    this.validateClient(client);
    this.validateService(service);
    this.validateBookingDate(bookingDate);
    this.validateBookingTime(bookingTime);

    // Combinando fecha y hora en un solo DateTime
    const dateTime = this.createDateTime(bookingDate, bookingTime);
    this.validateFutureDate(dateTime);

    this.client = client;
    this.service = service;
    this.bookingDate = bookingDate; // Formato: 'YYYY-MM-DD'
    this.bookingTime = bookingTime; // Formato: 'HH:MM'
    this.dateTime = dateTime; // Fecha y hora combinadas
    this.state = Booking.STATES.PENDING; // Por defecto es "pendiente"
    this.createdAt = new Date();
  }

  validateClient(client) {
    if (!client) {
      throw new Error('El cliente es obligatorio para crear una reserva.');
    }

    if (!client.fullName || !client.email || !client.phone) {
      throw new Error('El cliente debe tener nombre, email y teléfono.');
    }
  }

  validateService(service) {
    if (!service) {
      throw new Error('El servicio es obligatorio para crear una reserva.');
    }

    if (!service.name || !service.price) {
      throw new Error('El servicio debe tener nombre y precio.');
    }
  }

  validateBookingDate(date) {
    if (!date || date.trim() === '') {
      throw new Error('La fecha de reserva es obligatoria.');
    }

    // Verifica formato YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('La fecha debe estar en formato YYYY-MM-DD (ejemplo: 2026-02-15)');
    }

    // Verifica que sea una fecha válida
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('La fecha proporcionada no es válida.');
    }
  }

  validateBookingTime(time) {
    if (!time || time.trim() === '') {
      throw new Error('La hora de reserva es obligatoria.');
    }

    // Verifica formato HH:MM
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      throw new Error('La hora debe estar en formato HH:MM (ejemplo: 14:30)');
    }
  }

  // HELPER: Combinar fecha y hora en un objeto Date
  createDateTime(date, time) {
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours, 10));
    dateTime.setMinutes(parseInt(minutes, 10));
    dateTime.setSeconds(0);
    dateTime.setMilliseconds(0);
    
    return dateTime;
  }

  validateFutureDate(dateTime) {
    const now = new Date();
    
    if (dateTime <= now) {
      throw new Error('La fecha de reserva debe ser en el futuro, no se pueden hacer reservas en el pasado');
    }
  }

  // Confirma una reserva
  confirm() {
    if (this.state === Booking.STATES.CANCELLED) {
      throw new Error('No se puede confirmar una reserva cancelada');
    }

    this.state = Booking.STATES.CONFIRMED;
  }

  // Cancela una reserva
  cancel() {
    if (this.state === Booking.STATES.CANCELLED) {
      throw new Error('La reserva ya está cancelada');
    }

    this.state = Booking.STATES.CANCELLED;
  }

  // Verifica si la reserva está confirmada
  isConfirmed() {
    return this.state === Booking.STATES.CONFIRMED;
  }

  // Verifica si la reserva está cancelada
  isCancelled() {
    return this.state === Booking.STATES.CANCELLED;
  }

  // Verifica si la reserva está pendiente
  isPending() {
    return this.state === Booking.STATES.PENDING;
  }
  
  toJSON() {
    return {
      client: this.client.toJSON(),
      service: this.service.toJSON(),
      bookingDate: this.bookingDate,
      bookingTime: this.bookingTime,
      dateTime: this.dateTime,
      state: this.state,
      createdAt: this.createdAt
    };
  }
}

export default Booking;