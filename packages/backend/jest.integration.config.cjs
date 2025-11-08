module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.js'], // Solo tests de integración
  testTimeout: 60000, // 60 segundos para tests de integración (pueden ser más lentos)
  forceExit: true, // Forzar salida después de los tests
  detectOpenHandles: true, // Detectar handles abiertos que impidan la salida
  maxWorkers: 1, // Ejecutar en serie, no en paralelo (evita problemas con DB compartida)
};
