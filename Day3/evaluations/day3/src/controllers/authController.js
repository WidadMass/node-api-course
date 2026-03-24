const authService = require('../services/authService');
const env = require('../config/env');

const isProd = env.nodeEnv === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 jours
};

const handleRegister = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;
    const result = await authService.register(nom, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);

    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json({ user, accessToken });
  } catch (err) {
    next(err);
  }
};

const handleRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await authService.logout(refreshToken);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    next(err);
  }
};

const handleGetProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { handleRegister, handleLogin, handleRefresh, handleLogout, handleGetProfile };
