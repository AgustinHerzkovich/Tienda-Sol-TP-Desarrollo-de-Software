import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tienda Sol - Plataforma de Comercio Electrónico',
      version: '1.0.0',
      description: ` f
      `,
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
