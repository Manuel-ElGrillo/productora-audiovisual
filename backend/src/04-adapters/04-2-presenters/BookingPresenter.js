import CreateBookingOutputBoundary from "../../02-boundaries/CreateBookingOutputBoundary.js";

class BookingPresenter extends CreateBookingOutputBoundary{
    constructor(){
        super();
        // Aquí guardaremos el objeto res de Express para poder responder cuando el Interactor nos avise
        this.res = null;
    }
    /**
   * El Controller llama a este método ANTES de llamar al Interactor
   * para darnos acceso al objeto res de Express
   * 
   * @param {Object} res - HTTP Response de Express
   */
    setResponse(res) {
        this.res = res;
    }

    /**
   * El Interactor llama a este método cuando todo salió BIEN
   * Implementa el método success() del Output Boundary
   * 
   * @param {BookingResponseModel} responseModel
   */
    success(responseModel) {
    // Formateo de la respuesta para el cliente HTTP
        const httpResponse = {
            status: 'success',
            message: '¡Reserva creada exitosamente! Nos pondremos en contacto contigo pronto.',
            data: {
                client: {
                    name: responseModel.booking.client.fullName,
                    email: responseModel.booking.client.email,
                    phone: responseModel.booking.client.phone
                },
                service: {
                    name: responseModel.booking.service.name,
                    price: responseModel.booking.service.price
                },
                booking: {
                    date: responseModel.booking.bookingDate,
                    time: responseModel.booking.bookingTime,
                    state: responseModel.booking.state
                }
            },
            timestamp: responseModel.timestamp
        }
        this.res.status(201).json(httpResponse);
    }

      /**
   * El Interactor llama a este método cuando algo FALLÓ
   * Implementa el método failure() del Output Boundary
   * 
   * @param {BookingResponseModel} responseModel
   */
    failure(responseModel){
        const httpResponse = {
            status: 'error',
            message: responseModel.error,
            data: null,
            timestamp: responseModel.timestamp
        }

        this.res.status(400).json(httpResponse);
    }
}

export default BookingPresenter;