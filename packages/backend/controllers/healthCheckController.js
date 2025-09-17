export default class healthCheckController {
  // No poner cosas muy pesadas
  async healthCheck(req, res) {
    let dbStatus = 'unknown';
    /*try {
            // Simula chequeo de DB, reemplaza con tu lógica real
            // await db.ping();
            dbStatus = "ok";
        } catch (e) {
            dbStatus = "error";
        }*/
    dbStatus = 'disconnected';
    res.status(200).json({
      status: 'ok',
      db: dbStatus,
      version: process.env.npm_package_version,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}
