const { Router } = require('express');
const livresController = require('../controllers/livres.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validate, livreSchema } = require('../validators/livres.validator');

const router = Router();

router.get('/', livresController.handleGetAll);
router.get('/:id', livresController.handleGetById);
router.post('/', authenticate, validate(livreSchema), livresController.handleCreate);
router.put('/:id', authenticate, livresController.handleUpdate);
router.delete('/:id', authenticate, authorize('admin'), livresController.handleRemove);
router.post('/:id/emprunter', authenticate, livresController.handleEmprunter);
router.post('/:id/retourner', authenticate, livresController.handleRetourner);

module.exports = router;
