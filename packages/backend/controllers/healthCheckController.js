export default class healthCheckController {
  // No poner cosas muy pesadas
  async healthCheck(req, res, next) {
    try {
      res.status(200).json({
        status: 'ok',
        version: process.env.npm_package_version,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    } catch (error) {
      next(error);
    }
  }
}
