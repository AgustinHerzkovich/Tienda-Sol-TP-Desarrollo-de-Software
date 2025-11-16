import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

/**
 * Conecta a una base de datos MongoDB en memoria para tests
 */
export default async function connectToTestDB() {
  // Cerrar cualquier conexión existente
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Crear servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Conectado a MongoDB en memoria para tests');
}

/**
 * Desconecta y detiene el servidor MongoDB de test
 */
export async function disconnectTestDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
    console.log('Desconectado de MongoDB de test');
  }
}

/**
 * Limpia todas las colecciones de la BD de test
 */
export async function clearTestDB() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
