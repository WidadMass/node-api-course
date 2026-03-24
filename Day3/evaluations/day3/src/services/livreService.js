const prisma = require('../db/prisma');

const SORT_FIELDS = ['id', 'titre', 'auteur', 'annee', 'createdAt'];

const getAll = async (filters = {}) => {
  const {
    sortBy = 'id',
    order = 'asc',
    disponible,
    genre,
    search
  } = filters;

  const where = {};

  if (disponible !== undefined) {
    where.disponible = disponible;
  }

  if (genre) {
    where.genre = { contains: genre };
  }

  if (search) {
    where.OR = [
      { titre: { contains: search } },
      { auteur: { contains: search } },
      { genre: { contains: search } }
    ];
  }

  const safeSortBy = SORT_FIELDS.includes(sortBy) ? sortBy : 'id';
  const safeOrder = order === 'desc' ? 'desc' : 'asc';

  return prisma.livre.findMany({
    where,
    orderBy: { [safeSortBy]: safeOrder }
  });
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

const retourner = async (livreId, userId, userRole) => {
  return prisma.$transaction(async (tx) => {
    const emprunt = await tx.emprunt.findFirst({
      where: { livreId, dateRetour: null }
    });
    if (!emprunt) {
      const err = new Error('Aucun emprunt actif trouvé');
      err.status = 404;
      throw err;
    }

    if (emprunt.userId !== userId && userRole !== 'admin') {
      const err = new Error('Vous ne pouvez retourner que vos propres emprunts');
      err.status = 403;
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
