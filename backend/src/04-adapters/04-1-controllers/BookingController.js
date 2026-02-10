import BookingRequestModel from "../../02-boundaries/02-1-models/BookingRequestModel";

class BookingController{
    /**
   * Recibe el Interactor por inyección de dependencias.
   * El Controller no sabe QUÉ Interactor es, solo sabe
   * que tiene un método execute().
   * 
   * @param {CreateBookingInputBoundary} createBookingInteractor
   */
  
    constructor(createBookingInteractor){
        this.createBookingInteractor = createBookingInteractor;
        // Hacemos bind para que 'this' funcione correctamente cuando Express llame a estos métodos
        this.createBooking = this.createBooking.bind(this);
    }

    async createBooking(req, res){
        const { clientName, clientEmail, clientPhone, serviceName, serviceDescription, servicePrice, bookingDate, bookingTime } = req.body;

        const requestModel = new BookingRequestModel({
            clientName, clientEmail, clientPhone, serviceName, serviceDescription, servicePrice, bookingDate, bookingTime
        })

        this.createBookingInteractor.outputBoundary.setResponse(res);

        this.createBookingInteractor.execute(requestModel);
    }
}

export default BookingController;