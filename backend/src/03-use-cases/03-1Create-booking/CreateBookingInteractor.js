import Client from "../../01-entities/Client.js";
import Service from "../../01-entities/Service.js";
import Booking from "../../01-entities/Booking.js";
import BookingRequestModel from "../../02-boundaries/02-1-models/BookingRequestModel.js";
import BookingResponseModel from "../../02-boundaries/02-1-models/BookingResponseModel.js";
import CreateBookingInputBoundary from "../../02-boundaries/CreateBookingInputBoundary.js";

class CreateBookingInteractor extends CreateBookingInputBoundary{
  /**
   * El Interactor recibe dos dependencias por el constructor:
   * 
   * @param {BookingGateway} bookingGateway - Para guardar/buscar reservas en BD
   * @param {CreateBookingInputBoundary} outputBoundary - Para notificar al Presenter
   *
   */
    constructor(bookingGateway, outputBoundary){
        super();
        this.bookingGateway = bookingGateway;
        this.outputBoundary = outputBoundary;
    }

      /**
   * Ejecuta el caso de uso de crear una reserva
   * Implementa el método execute() del Input Boundary
   * 
   * @param {BookingRequestModel} requestModel - Datos enviados por el Controller
   */
    async execute(requestModel){
        try {
            const client = new Client(
                requestModel.clientName,
                requestModel.clientEmail,
                requestModel.clientPhone
            )

            const service = new Service(
                requestModel.serviceName,
                requestModel.serviceName,
                requestModel.servicePrice
            )

            const isAviable = await this.checkAvailability(
                requestModel.bookingDate,
                requestModel.bookingTime
            )

            if(!isAviable){
                const responseModel = BookingResponseModel.createFailure(
                    `La fecha ${requestModel.bookingDate} a las ${requestModel.bookingTime} no está disponible. Por favor elige otro horario.`
                );
                this.outputBoundary.createFailure(responseModel);
                return;
            }

            const booking = new Booking(
                requestModel.bookingDate,
                requestModel.bookingTime,
                client,
                service
            )

            const savedBooking = await this.bookingGateway.save(booking);

            const responseModel = BookingResponseModel.createSuccess(savedBooking);
            this.outputBoundary.success(responseModel);

        } catch(error) {
            const responseModel = BookingResponseModel.createFailure(error.message);
            this.outputBoundary.failure(responseModel);
        }
    } 

    /**
    * Verifica si una fecha/hora está disponible
    * Este es un método PRIVADO del Interactor (solo él lo usa)
    * 
    * @param {string} date - Fecha en formato YYYY-MM-DD
    * @param {string} time - Hora en formato HH:MM
    * @returns {Promise<boolean>} true si está disponible, false si no
    */
    async checkAvailability(date, time){
        const [hours, minutes] = time.split(":");
        const dateTime = new Date(date);

        dateTime.setHours(parseInt(hours, 10));
        dateTime.setMinutes(parseInt(minutes, 10));
        dateTime.setSeconds(0);
        dateTime.setMilliseconds(0);

        // Preguntamos al Gateway: ¿hay reservas en esta fecha/hora?
        const existingBookings = await this.bookingGateway.findByDateTime(dateTime);

        // Si no hay reservas existentes, está disponible
        return existingBookings.length === 0;
    }

}

export default CreateBookingInteractor;