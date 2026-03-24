const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque',
      version: '3.0.0',
      description: 'API REST sécurisée pour gérer une bibliothèque'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
