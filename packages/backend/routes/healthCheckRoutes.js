import express from 'express';
import HealthCheckController from '../controllers/healthCheckController.js';

const healthPath = '/health';

export default function healthCheckRoutes(getController) {
  const router = express.Router();
  const healthCheckController = getController(HealthCheckController);

  router.get(healthPath, async (req, res) => {
    await healthCheckController.healthCheck(req, res);
  });

  return router;
}
