const env = require('../config/env');

const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  // Log côté serveur sans données sensibles
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${status}`);
  console.error(err.message);
  if (env.nodeEnv !== 'production') {
    console.error(err.stack);
  }

  if (env.nodeEnv === 'production' && status >= 500) {
    return res.status(status).json({ message: 'Erreur interne' });
  }

  res.status(status).json({
    message: err.message || 'Erreur interne',
    ...(env.nodeEnv !== 'production' && { stack: err.stack })
  });
};

module.exports = { notFound, errorHandler };
