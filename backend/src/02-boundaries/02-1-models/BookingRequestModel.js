// Este es el modelo de ENTRADA para crear una reserva.
// Viaja desde el Controller hacia el Interactor.

class BookingRequestModel{
    constructor({
      clientName, 
      clientEmail,
      clientPhone,
      serviceId,
      bookingDate,
      bookingTime  
    }){
        // Datos del cliente
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.clientPhone = clientPhone;
        // Datos del servicio
        this.serviceId = serviceId;
        // Datos de la reserva
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
    }
}

export default BookingRequestModel;