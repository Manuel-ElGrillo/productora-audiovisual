// El Interactor necesita buscar servicios en la BD
// Este es el contrato para hacerlo
class ServiceGateway {
  /**
   * Busca un servicio por su ID
   * @param {string} serviceId
   * @returns {Promise<Object>} El servicio encontrado
   */
  async findById(serviceId) {
    throw new Error('Este método debe ser implementado por el Repository');
  }

  /**
   * Obtiene todos los servicios
   * @returns {Promise<Array>} Lista de servicios
   */
  async findAll() {
    throw new Error('Este método debe ser implementado por el Repository');
  }
}

export default ServiceGateway;