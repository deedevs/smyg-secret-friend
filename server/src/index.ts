import app from './app';
import { config } from './config';
import { connectDB } from './db';
import { initializeSystem } from './models/System';

async function startServer() {
  try {
    await connectDB();
    await initializeSystem();

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
