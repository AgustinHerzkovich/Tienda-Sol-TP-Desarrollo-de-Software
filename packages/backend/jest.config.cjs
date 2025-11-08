module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'], // Solo tests unitarios por defecto
  testTimeout: 10000, // 10 segundos para tests unitarios
  forceExit: true, // Forzar salida después de los tests
  detectOpenHandles: true, // Detectar handles abiertos que impidan la salida
};
