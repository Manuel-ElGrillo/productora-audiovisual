// Define la "puerta de salida"
// "Cuando termine de procesar:
// - success() si todo salió bien
// - failure() si algo falló"
// El Presenter implementa esta interfaz para recibir respuestas del Interactor.

class CreateBookingOutputBoundary {
  /**
   * Maneja una respuesta exitosa
   * @param {BookingResponseModel} responseModel - Respuesta con la reserva creada
   */
  success(responseModel) {
    throw new Error('Este método debe ser implementado por el Presenter');
  }

  /**
   * Maneja una respuesta de error
   * @param {BookingResponseModel} responseModel - Respuesta con el error
   */
  failure(responseModel) {
    throw new Error('Este método debe ser implementado por el Presenter');
  }
}

export default CreateBookingOutputBoundary;