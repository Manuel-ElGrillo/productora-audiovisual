class Client{
    constructor(fullName, email, phone){
        this.validateFullName(fullName);
        this.validateEmail(email);
        this.validatePhone(phone);

        this.fullName = fullName.trim();
        this.email = email.trim().toLowerCase();
        this.phone = phone.trim();
        this.createdAt = new Date();
    }

    // Validaciones
    validateFullName(fullName){
        if(!fullName || fullName.trim() === ""){
            throw new Error ("El nombre completo es obligatorio.");
        }

        if(fullName.trim().length < 2){ // Porque nunca falta un chino
            throw new Error ("El nombre no puede ser menor a 2 caracteres.");
        }

        // Verificando que al menos tenga nombre y apellido (dos palabras)
        const completeName = fullName.trim().split(" ").filter( name => name.length > 0 );

        if(completeName.lenght < 2) {
            throw new Error ("Se debe proporcionar nombre y apellido.");
        }
    }

    validateEmail(email){
        if(!email || email.trim() === ""){
            throw new Error ("El email es obligatorio.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            throw new Error('El formato del email no es válido');
        }
    }

    validatePhone(phone){
        if(!phone || phone.trim() === ""){
            throw new Error ("El número de tléfono es obligatorio");
        }

        // Eliminando espacios, guiones y paréntesis sólo para que sean permitido números
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

        // Verificando que tenga al menos 8 dígitos y el código de área con el +
        const phoneRegex = /^\+?\d{8,15}$/;

        if (!phoneRegex.test(cleanPhone)) {
            throw new Error('El teléfono debe tener entre 8 y 15 dígitos');
        }
    }

    toJSON(){
        return {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            createdAt: this.createdAt
        }
    }
}

export default Client;