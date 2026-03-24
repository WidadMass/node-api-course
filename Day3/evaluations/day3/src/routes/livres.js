const { Router } = require('express');
const ctrl = require('../controllers/livresController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const validate = require('../middlewares/validate');
const { livreCreateSchema, livreUpdateSchema } = require('../validators/livreValidator');

const router = Router();

/**
 * @swagger
 * /api/livres:
 *   get:
 *     summary: Liste de tous les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres
 */
router.get('/', ctrl.handleGetAll);

/**
 * @swagger
 * /api/livres/{id}:
 *   get:
 *     summary: Détail d'un livre
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre trouvé
 *       404:
 *         description: Livre non trouvé
 */
router.get('/:id', ctrl.handleGetById);

/**
 * @swagger
 * /api/livres:
 *   post:
 *     summary: Ajouter un livre (authentifié)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titre, auteur]
 *             properties:
 *               titre:
 *                 type: string
 *               auteur:
 *                 type: string
 *               annee:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livre créé
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticate, validate(livreCreateSchema), ctrl.handleCreate);

/**
 * @swagger
 * /api/livres/{id}:
 *   put:
 *     summary: Modifier un livre (authentifié)
 *     tags: [Livres]
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
 *         description: Livre modifié
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Livre non trouvé
 */
router.put('/:id', authenticate, validate(livreUpdateSchema), ctrl.handleUpdate);

/**
 * @swagger
 * /api/livres/{id}:
 *   delete:
 *     summary: Supprimer un livre (admin)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Livre supprimé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Admin requis
 */
router.delete('/:id', authenticate, authorize('admin'), ctrl.handleRemove);

/**
 * @swagger
 * /api/livres/{id}/emprunter:
 *   post:
 *     summary: Emprunter un livre (authentifié)
 *     tags: [Livres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Livre emprunté
 *       401:
 *         description: Non authentifié
 *       409:
 *         description: Livre déjà emprunté
 */
router.post('/:id/emprunter', authenticate, ctrl.handleEmprunter);

/**
 * @swagger
 * /api/livres/{id}/retourner:
 *   post:
 *     summary: Retourner un livre (authentifié)
 *     tags: [Livres]
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
 *         description: Livre retourné
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Aucun emprunt actif
 */
router.post('/:id/retourner', authenticate, ctrl.handleRetourner);

module.exports = router;
