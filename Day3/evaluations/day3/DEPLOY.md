# Déploiement

## API en production

**URL publique :** https://api-biblio-day3.onrender.com

**Hébergeur :** Render (plan gratuit)

### Routes disponibles

- `GET /api/livres` — Liste des livres
- `POST /api/auth/register` — Créer un compte
- `POST /api/auth/login` — Se connecter
- `GET /api-docs` — Documentation Swagger

### Variables d'environnement configurées

- `NODE_ENV=production`
- `PORT=3000`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN=15m`
- `ALLOWED_ORIGINS`
- `DATABASE_URL=file:./dev.db`
