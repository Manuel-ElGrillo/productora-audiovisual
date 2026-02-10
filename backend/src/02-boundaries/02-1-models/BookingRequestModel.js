// Este es el modelo de ENTRADA para crear una reserva.
// Viaja desde el Controller hacia el Interactor.

class BookingRequestModel{
    constructor({
      clientName, 
      clientEmail,
      clientPhone,
      serviceName,
      serviceDescription,
      servicePrice,
      bookingDate,
      bookingTime  
    }){
        // Datos del cliente
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.clientPhone = clientPhone;
        // Datos del servicio
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription;
        this.servicePrice = servicePrice;
        // Datos de la reserva
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
    }
}

export default BookingRequestModel;