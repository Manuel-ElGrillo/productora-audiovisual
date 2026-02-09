class Service {
    constructor(name, description, price){
        this.validateName(name);
        this.validateDescription(description);
        this.validatePrice(price);

        this.name = name.trim();
        this.description = description.trim();
        this.price = Number(price);
        this.createdAt = new Date();
    }

    // Validaciones
    validateName(name){
        if(!name || name.trim() === ""){
            throw new Error ("El nombre del servicio es obligatorio.");
        }

        if(name.trim().length < 3){
            throw new Error ("El nombre del servicio debe ser escrito completo.");
        }
    }

    validateDescription(description){
        if(!description || description.trim() === ""){
            throw new Error ("La descripción no debe estar vacía");
        }

        if(description.trim() < 10){
            throw new Error ("La descripción debe ser más completa");
        }
    }

    validatePrice(price){
        if(price === null || price === "" || price === undefined){
            throw new Error ("El precio del servicio es obligatorio");
        }

        const numericPrice = Number(price);

        if(isNaN(numericPrice)){
            throw new Error ("El precio debe ser un número válido");
        }

        if(numericPrice <= 0){
            throw new Error ("El precio debe ser mayor a 0");
        }
    }

    // Método para obtener la info del servicio
    toJSON(){
        return {
            name: this.name,
            description: this.description,
            price: this.price,
            createdAt: this.createdAt
        }
    }
}

export default Service;