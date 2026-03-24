const { Router } = require('express');
const ctrl = require('../controllers/usersController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { userRoleSchema } = require('../validators/userValidator');

const router = Router();

router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste des utilisateurs (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Admin requis
 */
router.get('/', ctrl.handleGetAll);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Modifier le rôle d'un utilisateur (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Admin requis
 *       404:
 *         description: Utilisateur non trouvé
 */
router.patch('/:id/role', validate(userRoleSchema), ctrl.handleUpdateRole);

module.exports = router;