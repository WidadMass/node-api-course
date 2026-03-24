const prisma = require('../db/prisma');

const getAll = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { emprunts: true }
      }
    },
    orderBy: { id: 'asc' }
  });
};

const updateRole = async (id, role) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    throw err;
  }

  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

module.exports = { getAll, updateRole };