// Este es el modelo de SALIDA después de crear una reserva.
// Viaja desde el Interactor hacia el Presenter.

class BookingResponseModel{
    constructor({success, booking = null, error = null}){
        this.success = success;
        this.booking = booking;
        this.error = error;
        this.timeStamp = new Date();
    }

    // Método para respuesta exitosa
    static createSuccess(booking){
        return new BookingResponseModel({
            success: true,
            booking: booking,
            error: null
        });
    }

    // Método para respuesta fallida
    static createFailure(errorMsg){
        return new BookingResponseModel({
            success: false,
            booking: null,
            error: errorMsg,
        });
    }
}

export default BookingResponseModel;