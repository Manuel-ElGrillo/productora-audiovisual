import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ MongoDB ya está conectado');
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`✅ MongoDB conectado: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    throw error;
  }
};

// Conectar automáticamente al importar
await connectDB();

export default connectDB;