const prisma = require('../db/prisma');

const getAllLivres = async () => {
  return prisma.livre.findMany();
};

const getLivreById = async (id) => {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const error = new Error('Livre non trouvé');
    error.statusCode = 404;
    throw error;
  }
  return livre;
};

const createLivre = async (data) => {
  return prisma.livre.create({ data });
};

const updateLivre = async (id, data) => {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const error = new Error('Livre non trouvé');
    error.statusCode = 404;
    throw error;
  }
  return prisma.livre.update({ where: { id }, data });
};

const deleteLivre = async (id) => {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const error = new Error('Livre non trouvé');
    error.statusCode = 404;
    throw error;
  }
  return prisma.livre.delete({ where: { id } });
};

const emprunterLivre = async (livreId, userId) => {
  return prisma.$transaction(async (tx) => {
    const livre = await tx.livre.findUnique({ where: { id: livreId } });

    if (!livre) {
      const error = new Error('Livre non trouvé');
      error.statusCode = 404;
      throw error;
    }

    if (!livre.disponible) {
      const error = new Error('Ce livre est déjà emprunté');
      error.statusCode = 409;
      throw error;
    }

    await tx.livre.update({
      where: { id: livreId },
      data: { disponible: false }
    });

    const emprunt = await tx.emprunt.create({
      data: { livreId, userId }
    });

    return emprunt;
  });
};

const retournerLivre = async (livreId, userId) => {
  return prisma.$transaction(async (tx) => {
    const emprunt = await tx.emprunt.findFirst({
      where: { livreId, userId, dateRetour: null }
    });

    if (!emprunt) {
      const error = new Error("Aucun emprunt en cours trouvé pour ce livre");
      error.statusCode = 404;
      throw error;
    }

    await tx.livre.update({
      where: { id: livreId },
      data: { disponible: true }
    });

    const updated = await tx.emprunt.update({
      where: { id: emprunt.id },
      data: { dateRetour: new Date() }
    });

    return updated;
  });
};

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  emprunterLivre,
  retournerLivre
};
