const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/auth');
const livresRoutes = require('./routes/livres');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Sécurité
app.use(helmet());

// CORS
if (env.nodeEnv === 'production' && env.allowedOrigins.length > 0) {
  app.use(cors({ origin: env.allowedOrigins, credentials: true }));
} else {
  app.use(cors({ origin: true, credentials: true }));
}

// Logging
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Parsers
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Rate limiter global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Trop de requêtes, réessayez plus tard' }
});
app.use(globalLimiter);

// Rate limiter strict sur auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/livres', livresRoutes);

// Erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;
