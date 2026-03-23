const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');
const { validate, registerSchema, loginSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/register', validate(registerSchema), authController.handleRegister);
router.post('/login', validate(loginSchema), authController.handleLogin);
router.get('/me', authenticate, authController.handleGetProfile);

module.exports = router;
