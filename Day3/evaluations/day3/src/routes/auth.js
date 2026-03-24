const { Router } = require('express');
const ctrl = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nom, email, password]
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Compte créé
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', validate(registerSchema), ctrl.handleRegister);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter (retourne access token + cookie refresh)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', validate(loginSchema), ctrl.handleLogin);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir l'access token via le cookie refresh
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Nouveau access token
 *       401:
 *         description: Refresh token invalide ou expiré
 */
router.post('/refresh', ctrl.handleRefresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Se déconnecter (supprime le refresh token)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', ctrl.handleLogout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/me', authenticate, ctrl.handleGetProfile);

module.exports = router;
