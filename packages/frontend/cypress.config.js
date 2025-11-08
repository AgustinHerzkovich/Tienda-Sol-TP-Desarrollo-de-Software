const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.FRONTEND_URL =
        process.env.FRONTEND_URL || 'http://localhost:3000';
      return config;
    },
  },
});
