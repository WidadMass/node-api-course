const livreService = require('../services/livreService');

const handleGetAll = async (req, res, next) => {
  try {
    const { sortBy, order, disponible, genre, search } = req.query;
    const livres = await livreService.getAll({
      sortBy,
      order,
      disponible: disponible === undefined ? undefined : disponible === 'true',
      genre,
      search
    });
    res.json(livres);
  } catch (err) {
    next(err);
  }
};

const handleGetById = async (req, res, next) => {
  try {
    const livre = await livreService.getById(Number(req.params.id));
    res.json(livre);
  } catch (err) {
    next(err);
  }
};

const handleCreate = async (req, res, next) => {
  try {
    const { titre, auteur, annee, genre } = req.body;
    const livre = await livreService.create(titre, auteur, annee, genre);
    res.status(201).json(livre);
  } catch (err) {
    next(err);
  }
};

const handleUpdate = async (req, res, next) => {
  try {
    const { titre, auteur, annee, genre } = req.body;
    const livre = await livreService.update(Number(req.params.id), titre, auteur, annee, genre);
    res.json(livre);
  } catch (err) {
    next(err);
  }
};

const handleRemove = async (req, res, next) => {
  try {
    await livreService.remove(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const handleEmprunter = async (req, res, next) => {
  try {
    const emprunt = await livreService.emprunter(Number(req.params.id), req.user.id);
    res.status(201).json(emprunt);
  } catch (err) {
    next(err);
  }
};

const handleRetourner = async (req, res, next) => {
  try {
    const emprunt = await livreService.retourner(Number(req.params.id), req.user.id, req.user.role);
    res.json(emprunt);
  } catch (err) {
    next(err);
  }
};

module.exports = { handleGetAll, handleGetById, handleCreate, handleUpdate, handleRemove, handleEmprunter, handleRetourner };
