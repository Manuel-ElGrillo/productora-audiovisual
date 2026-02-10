import 'dotenv/config';
import createApp from './src/frameworks/webserver/express-app.js';
import connectDB from './src/frameworks/database/mongodb.js';

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