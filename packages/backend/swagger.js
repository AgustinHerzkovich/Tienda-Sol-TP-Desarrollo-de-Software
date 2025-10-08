import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app) {
  const fileContents = fs.readFileSync('./docs/api-docs.yaml', 'utf8');
  const swaggerDocument = yaml.load(fileContents);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
