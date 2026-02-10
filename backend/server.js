import 'dotenv/config';
import createApp from './src/05-frameworks/05-3-webservers/express-app.js';
import connectDB from './src/05-frameworks/database/mongodb.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {

  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();