// Define la "puerta de entrada":
// "Si quieres crear una reserva, DEBES llamar al método execute()
// y DEBES pasarme un BookingRequestModel"
// El Controller implementa/usa esta interfaz para hablar con el Interactor.

class CreateBookingInputBoundary{
    /** 
     * Ejecuta el caso de uso para una reserva
     * @param {BookingRequestModel} requestModel - Datos de la reserva
     * @returns {Promise<void>} 
    */
   async execute(requestModel){
    throw new Error ("Este método debe ser implementado por el Interactor")
   }
}

export default CreateBookingInputBoundary;