const env = require('./config/env');
const app = require('./app');

app.listen(env.port, () => {
  console.log(`Serveur lancé sur le port ${env.port}`);
});
