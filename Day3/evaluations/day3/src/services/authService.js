const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../db/prisma');
const env = require('../config/env');

const register = async (nom, email, password) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email déjà utilisé');
    err.status = 409;
    throw err;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nom, email, password: hash },
    select: { id: true, nom: true, email: true, role: true }
  });

  return { user };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  // Génère un refresh token aléatoire et le stocke en base
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt }
  });

  const { password: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const err = new Error('Refresh token manquant');
    err.status = 401;
    throw err;
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  });

  if (!stored || stored.expiresAt < new Date()) {
    // Supprime le token expiré s'il existe
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    const err = new Error('Refresh token invalide ou expiré');
    err.status = 401;
    throw err;
  }

  const accessToken = jwt.sign(
    { id: stored.user.id, email: stored.user.email, role: stored.user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return { accessToken };
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;

  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken }
  });
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, nom: true, email: true, role: true, createdAt: true }
  });

  if (!user) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    throw err;
  }

  return user;
};

module.exports = { register, login, refresh, logout, getProfile };
