import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tienda Sol - Plataforma de Comercio Electrónico',
      version: '1.0.0',
      description: `Documentación de la API de Tienda Sol`,
    },
    servers: [
      {
        url: 'http://localhost:' + process.env.SERVER_PORT,
      },
    ],
  },
  apis: ['./routes/*.js', './docs/swaggerComponents.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
