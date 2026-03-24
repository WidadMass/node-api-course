const prisma = require('../db/prisma');

const getAll = async () => {
  return prisma.livre.findMany({ orderBy: { id: 'asc' } });
};

const getById = async (id) => {
  const livre = await prisma.livre.findUnique({ where: { id } });
  if (!livre) {
    const err = new Error('Livre non trouvé');
    err.status = 404;
    throw err;
  }
  return livre;
};

const create = async (titre, auteur, annee, genre) => {
  return prisma.livre.create({
    data: { titre, auteur, annee, genre }
  });
};

const update = async (id, titre, auteur, annee, genre) => {
  await getById(id);
  const data = {};
  if (titre !== undefined) data.titre = titre;
  if (auteur !== undefined) data.auteur = auteur;
  if (annee !== undefined) data.annee = annee;
  if (genre !== undefined) data.genre = genre;

  return prisma.livre.update({ where: { id }, data });
};

const remove = async (id) => {
  await getById(id);
  await prisma.emprunt.deleteMany({ where: { livreId: id } });
  return prisma.livre.delete({ where: { id } });
};

const emprunter = async (livreId, userId) => {
  return prisma.$transaction(async (tx) => {
    const livre = await tx.livre.findUnique({ where: { id: livreId } });
    if (!livre) {
      const err = new Error('Livre non trouvé');
      err.status = 404;
      throw err;
    }
    if (!livre.disponible) {
      const err = new Error('Livre déjà emprunté');
      err.status = 409;
      throw err;
    }

    await tx.livre.update({ where: { id: livreId }, data: { disponible: false } });

    return tx.emprunt.create({
      data: { userId, livreId }
    });
  });
};

const retourner = async (livreId, userId) => {
  return prisma.$transaction(async (tx) => {
    const emprunt = await tx.emprunt.findFirst({
      where: { livreId, dateRetour: null }
    });
    if (!emprunt) {
      const err = new Error('Aucun emprunt actif trouvé');
      err.status = 404;
      throw err;
    }

    await tx.livre.update({ where: { id: livreId }, data: { disponible: true } });

    return tx.emprunt.update({
      where: { id: emprunt.id },
      data: { dateRetour: new Date() }
    });
  });
};

module.exports = { getAll, getById, create, update, remove, emprunter, retourner };
