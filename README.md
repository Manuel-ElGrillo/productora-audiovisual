# 🎬 Productora Audiovisual - Clean Architecture

Sistema de reservas de servicios audiovisuales construido siguiendo los conceptos de **Clean Architecture** de Robert C. Martin.

---

## 📐 Arquitectura del Proyecto
```
productora-audiovisual/
├── backend/              # Node.js + Express + MongoDB
│   └── src/
│       ├── entities/           # 🔵 Capa 1: Reglas de negocio
│       ├── use-cases/          # 🟢 Capa 2: Lógica de aplicación
│       ├── boundaries/         # ⭐ Contratos/Interfaces
│       ├── adapters/           # 🟡 Capa 3: Traductores
│       └── frameworks/         # 🔴 Capa 4: Frameworks externos
│
└── frontend/             # Astro + CSS puro
    └── src/
        ├── pages/
        ├── components/
        ├── layouts/
        └── styles/
```

---

## 🔄 FLUJO COMPLETO: "Usuario reserva un servicio"

### **CONTEXTO DEL FLUJO:**
Un usuario entra al sitio web, selecciona un servicio (ejemplo: "Grabación de Jingle"), llena el formulario con sus datos personales, elige fecha/hora y presiona "CONFIRMAR RESERVA".

---

## 📍 PASO A PASO DETALLADO

### **FRONTEND (Astro)**

#### **PASO 1: Usuario interactúa con el formulario**
- **Archivo:** `frontend/src/pages/contacto.astro`
- **Qué sucede:** 
  - Usuario llena: nombre, email, teléfono
  - Selecciona un servicio del dropdown (cargado desde `/api/services`)
  - Elige fecha y hora
  - Presiona botón "CONFIRMAR RESERVA"

---

#### **PASO 2: JavaScript captura el evento submit**
- **Archivo:** `frontend/src/pages/contacto.astro`

---

#### **PASO 3: Frontend envía petición HTTP al backend**
- **Archivo:** `frontend/src/pages/contacto.astro`

```
- **Datos enviados:**
```json
  {
    "clientName": "Juan Pérez",
    "clientEmail": "juan@gmail.com",
    "clientPhone": "+5491123456789",
    "serviceId": "******************",
    "bookingDate": "2026-03-15",
    "bookingTime": "14:30"
  }
```

---

### **BACKEND (Node.js + Express)**

#### **PASO 4: Express recibe la petición HTTP**
- **Archivo:** `backend/src/frameworks/webserver/express-app.js`
- **Líneas:** 18
- **Qué sucede:**
  - Express detecta `POST /api/bookings`
  - Redirige la petición a las rutas de bookings

---

#### **PASO 5: Router identifica la ruta correcta**
- **Archivo:** `backend/src/frameworks/webserver/routes/bookingRoutes.js`

```
- **Ensamblaje previo:**
```javascript
  // 1. Se crea el Repository (acceso a MongoDB)
  const bookingRepository = new MongoBookingRepository();
  
  // 2. Se crea el Repository de servicios
  const serviceRepository = new MongoServiceRepository();
  
  // 3. Se crea el Presenter (formatea respuestas)
  const bookingPresenter = new BookingPresenter();
  
  // 4. Se crea el Interactor (lógica de negocio)
  const createBookingInteractor = new CreateBookingInteractor(
    bookingRepository,
    serviceRepository,
    bookingPresenter
  );
  
  // 5. Se crea el Controller (recibe HTTP)
  const bookingController = new BookingController(createBookingInteractor);
```

---

### **🟡 CAPA 3: ADAPTERS**

#### **PASO 6: Controller recibe la petición HTTP**
- **Archivo:** `backend/src/adapters/controllers/BookingController.js`
- (método `createBooking`)
- **Qué sucede:**
  1. **Extrae datos del req.body:**
```javascript
     const { clientName, clientEmail, clientPhone, 
             serviceId, bookingDate, bookingTime } = req.body;
```
  
  2. **Crea un RequestModel:**
```javascript
     const requestModel = new BookingRequestModel({
       clientName,
       clientEmail,
       clientPhone,
       serviceId,
       bookingDate,
       bookingTime
     });
```
     - **Traducción:** Convierte el lenguaje HTTP al lenguaje del Interactor

  3. **Pasa el objeto `res` al Presenter:**
```javascript
     this.createBookingInteractor.outputBoundary.setResponse(res);
```
     - **Razón:** El Presenter necesitará `res` para responder al cliente más tarde

  4. **Llama al Interactor:**
```javascript
     await this.createBookingInteractor.execute(requestModel);
```
     - **El Controller entrega y se va.** Ya no hace nada más.

---

### **🟢 CAPA 2: USE CASES**

#### **PASO 7: Interactor recibe el RequestModel**
- **Archivo:** `backend/src/use-cases/CreateBooking/CreateBookingInteractor.js`
- (método `execute`)


##### **PASO 7.1: Crear Entity Client**
```javascript
const client = new Client(
  requestModel.clientName,
  requestModel.clientEmail,
  requestModel.clientPhone
);
```
- **¿Qué hace?** Va a `entities/Client.js` y ejecuta validaciones:
  - ¿El nombre tiene al menos 2 palabras?
  - ¿El email tiene formato válido?
  - ¿El teléfono tiene entre 8-15 dígitos?
- **Si falla:** Lanza un `Error` que se captura en el `catch`

##### **PASO 7.2: Buscar servicio en BBDD**
```javascript
const serviceData = await this.serviceGateway.findById(requestModel.serviceId);
```
- **¿Qué hace?** Llama al **ServiceGateway** → **MongoServiceRepository** → **MongoDB**
- **Flujo interno:**
  1. `ServiceGateway` (interfaz/contrato en `boundaries/gateways/ServiceGateway.js`)
  2. `MongoServiceRepository` (implementación en `frameworks/database/repositories/MongoServiceRepository.js`)
  3. MongoDB busca el servicio por ID
  4. Retorna: `{ name, description, price, ... }`

##### **PASO 7.3: Crear Entity Service**
```javascript
const service = new Service(
  serviceData.name,
  serviceData.description,
  serviceData.price  // ← Precio de la BD, NO del cliente
);
```
- **¿Qué hace?** Va a `entities/Service.js` y ejecuta validaciones:
  - ¿El nombre tiene al menos 3 caracteres?
  - ¿La descripción tiene al menos 10 caracteres?
  - ¿El precio es mayor a 0?


##### **PASO 7.4: Verificar disponibilidad**
```javascript
const isAvailable = await this.checkAvailability(
  requestModel.bookingDate,
  requestModel.bookingTime
);

if (!isAvailable) {
  // Crear ResponseModel de error y notificar al Presenter
  this.outputBoundary.failure(responseModel);
  return;
}
```
- **¿Qué hace?** Llama al método privado `checkAvailability`:
  1. Combina fecha + hora en un objeto `Date`
  2. Llama a `bookingGateway.findByDateTime(dateTime)`
  3. MongoDB busca reservas en esa fecha/hora exacta
  4. Si `existingBookings.length > 0` → **NO disponible**
  5. Si `existingBookings.length === 0` → **Disponible**

##### **PASO 7.5: Crear Entity Booking**
```javascript
const booking = new Booking(
  client,
  service,
  requestModel.bookingDate,
  requestModel.bookingTime
);
```
- **¿Qué hace?** Va a `entities/Booking.js` y ejecuta validaciones:
  - ¿El cliente tiene fullName, email y phone?
  - ¿El servicio tiene name y price?
  - ¿La fecha tiene formato `YYYY-MM-DD`?
  - ¿La hora tiene formato `HH:MM`?
  - ¿La fecha/hora es futura (no en el pasado)?
- **Estado inicial:** `state = 'pendiente'`

##### **PASO 7.6: Guardar en BBDD**
```javascript
const savedBooking = await this.bookingGateway.save(booking);
```
- **¿Qué hace?** Llama al **BookingGateway** → **MongoBookingRepository** → **MongoDB**
- **Flujo interno:**
  1. `BookingGateway` (interfaz en `boundaries/gateways/BookingGateway.js`)
  2. `MongoBookingRepository.save()` (en `frameworks/database/repositories/MongoBookingRepository.js`)
  3. Convierte la Entity a formato MongoDB:
```javascript
     const bookingData = {
       client: { fullName, email, phone },
       service: { name, description, price },
       bookingDate: "2026-03-15",
       bookingTime: "14:30",
       dateTime: Date object,
       state: "pendiente"
     }
```
  4. `await BookingModel.create(bookingData)` → **guarda en MongoDB**
  5. Retorna el documento guardado con `_id`

##### **PASO 7.7: Notificar éxito al Presenter**
```javascript
const responseModel = BookingResponseModel.createSuccess(savedBooking);
this.outputBoundary.success(responseModel);
```
- **¿Qué hace?**
  1. Crea un `BookingResponseModel` con:
```javascript
     {
       success: true,
       booking: savedBooking,
       error: null,
       timestamp: new Date()
     }
```
  2. Llama al método `success()` del **Presenter**

---

### **🟡 CAPA 3: ADAPTERS (Presenter)**

#### **PASO 8: Presenter formatea la respuesta**
- **Archivo:** `backend/src/adapters/presenters/BookingPresenter.js`
- (método `success`)
- **Qué sucede:**

##### **PASO 8.1: Formatear para HTTP**
```javascript
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
};
```

##### **PASO 8.2: Enviar respuesta HTTP**
```javascript
this.res.status(201).json(httpResponse);
```
- **HTTP Status:** `201 Created` (éxito al crear recurso)
- **Content-Type:** `application/json`

---

### **FRONTEND (Astro) - RESPUESTA**

#### **PASO 9: Frontend recibe la respuesta**
- **Archivo:** `frontend/src/pages/contacto.astro`

##### **PASO 9.1: Parsear respuesta**
```javascript
const data = await response.json();
```

##### **PASO 9.2: Verificar éxito**
```javascript
if (response.ok && data.status === 'success') {
  // Mostrar mensaje de éxito
  responseMessage.textContent = '✅ ' + data.message;
  responseMessage.className = 'response-message success';
  
  // Resetear formulario
  form.reset();
  
  // Scroll al mensaje
  responseMessage.scrollIntoView({ behavior: 'smooth' });
}
```

##### **PASO 9.3: Usuario ve confirmación**
- **Mensaje en pantalla:**
```
  ✅ ¡Reserva creada exitosamente! Nos pondremos en contacto contigo pronto.
```
- **Formulario:** Se limpia automáticamente
- **Base de datos:** La reserva está guardada en MongoDB

---

## 📊 RESUMEN DEL FLUJO (Numerado)
```
1️⃣  Usuario llena formulario (contacto.astro)
2️⃣  JavaScript captura submit (contacto.astro)
3️⃣  Frontend envía POST a /api/bookings (fetch)
     ↓
4️⃣  Express recibe petición (express-app.js)
5️⃣  Router redirige a bookingController (bookingRoutes.js)
     ↓
6️⃣  Controller extrae datos y crea RequestModel (BookingController.js)
7️⃣  Controller llama a Interactor.execute()
     ↓
8️⃣  Interactor crea Entity Client (Client.js) → VALIDACIONES
9️⃣  Interactor busca servicio en BD (ServiceGateway → MongoServiceRepository → MongoDB)
🔟 Interactor crea Entity Service (Service.js) → VALIDACIONES
1️⃣1️⃣ Interactor verifica disponibilidad (BookingGateway → MongoBookingRepository → MongoDB)
1️⃣2️⃣ Interactor crea Entity Booking (Booking.js) → VALIDACIONES
1️⃣3️⃣ Interactor guarda en BD (BookingGateway → MongoBookingRepository → MongoDB)
1️⃣4️⃣ Interactor crea ResponseModel y llama a Presenter.success()
     ↓
1️⃣5️⃣ Presenter formatea respuesta HTTP (BookingPresenter.js)
1️⃣6️⃣ Presenter envía res.status(201).json() al cliente
     ↓
1️⃣7️⃣ Frontend recibe JSON (contacto.astro)
1️⃣8️⃣ Frontend muestra mensaje de éxito al usuario
```

---

## 🗂️ ARCHIVOS INVOLUCRADOS (En orden de uso)

### **Frontend:**
1. `frontend/src/pages/contacto.astro` (HTML + JavaScript)

### **Backend - Frameworks (Capa 4):**
2. `backend/src/frameworks/webserver/express-app.js` (Express setup)
3. `backend/src/frameworks/webserver/routes/bookingRoutes.js` (Ensamblaje + Rutas)

### **Backend - Adapters (Capa 3):**
4. `backend/src/adapters/controllers/BookingController.js` (Recibe HTTP)
5. `backend/src/adapters/presenters/BookingPresenter.js` (Formatea respuesta)

### **Backend - Boundaries:**
6. `backend/src/boundaries/models/BookingRequestModel.js` (Modelo de entrada)
7. `backend/src/boundaries/models/BookingResponseModel.js` (Modelo de salida)
8. `backend/src/boundaries/gateways/BookingGateway.js` (Contrato para BD)
9. `backend/src/boundaries/gateways/ServiceGateway.js` (Contrato para servicios)

### **Backend - Use Cases (Capa 2):**
10. `backend/src/use-cases/CreateBooking/CreateBookingInteractor.js` (Lógica)

### **Backend - Entities (Capa 1):**
11. `backend/src/entities/Client.js` (Validaciones de cliente)
12. `backend/src/entities/Service.js` (Validaciones de servicio)
13. `backend/src/entities/Booking.js` (Validaciones de reserva)

### **Backend - Frameworks (Base de datos):**
14. `backend/src/frameworks/database/repositories/MongoBookingRepository.js` (Implementa BookingGateway)
15. `backend/src/frameworks/database/repositories/MongoServiceRepository.js` (Implementa ServiceGateway)
16. `backend/src/frameworks/database/schemas/BookingSchema.js` (Schema de Mongoose)
17. `backend/src/frameworks/database/schemas/ServiceSchema.js` (Schema de Mongoose)
18. `backend/src/frameworks/database/mongodb.js` (Conexión a MongoDB)

**Total:** 18 archivos participan en este flujo

---

## 🎯 PRINCIPIOS DE CLEAN ARCHITECTURE APLICADOS

### **1. Dependency Rule (Regla de Dependencias)**
```
Las dependencias apuntan HACIA ADENTRO:

Frameworks → Adapters → Use Cases → Entities

❌ Una Entity NUNCA conoce Express o MongoDB
✅ Express y MongoDB conocen las Entities
```

### **2. Inyección de Dependencias**
```javascript
// El Interactor NO crea sus dependencias
// Se las "inyectan" desde afuera (bookingRoutes.js)

const interactor = new CreateBookingInteractor(
  bookingRepository,    // ← Inyectado
  serviceRepository,    // ← Inyectado
  bookingPresenter      // ← Inyectado
);
```

**Beneficio:** Si mañana cambias MongoDB por PostgreSQL, solo cambias el Repository. TODO lo demás queda igual.

### **3. Boundaries (Contratos)**
```javascript
// BookingGateway define QUÉ se puede hacer
class BookingGateway {
  save(booking) { throw new Error('Implementar'); }
  findByDateTime(dateTime) { throw new Error('Implementar'); }
}

// MongoBookingRepository define CÓMO se hace
class MongoBookingRepository extends BookingGateway {
  save(booking) { /* usa MongoDB */ }
  findByDateTime(dateTime) { /* usa MongoDB */ }
}
```

**Beneficio:** El Interactor no sabe si usa MongoDB, MySQL o un archivo JSON. Solo sabe que puede llamar a `save()` y `findByDateTime()`.

### **4. Entities (Reglas de Negocio)**
```javascript
// Las validaciones viven en las Entities
// NO en el Controller, NO en la BD

class Booking {
  constructor(...) {
    this.validateFutureDate(dateTime);
    // Si la fecha es pasada → lanza Error
    // Esta regla se cumple SIEMPRE
  }
}
```

**Beneficio:** Las reglas de negocio están centralizadas y se reutilizan en todo el sistema.

---

## 📚 RECURSOS DE APRENDIZAJE

- **Clean Architecture** - Robert C. Martin
- **Entities:** Objetos con reglas de negocio fundamentales
- **Use Cases:** Orquestadores de lógica de aplicación
- **Boundaries:** Contratos que desacoplan capas
- **Adapters:** Traductores entre el mundo exterior y la lógica
- **Frameworks:** Herramientas externas (Express, MongoDB)

---