const livresService = require('../services/livres.service');

const handleGetAll = async (req, res, next) => {
  try {
    const livres = await livresService.getAllLivres();
    res.json(livres);
  } catch (err) {
    next(err);
  }
};

const handleGetById = async (req, res, next) => {
  try {
    const livre = await livresService.getLivreById(Number(req.params.id));
    res.json(livre);
  } catch (err) {
    next(err);
  }
};

const handleCreate = async (req, res, next) => {
  try {
    const livre = await livresService.createLivre(req.body);
    res.status(201).json(livre);
  } catch (err) {
    next(err);
  }
};

const handleUpdate = async (req, res, next) => {
  try {
    const livre = await livresService.updateLivre(Number(req.params.id), req.body);
    res.json(livre);
  } catch (err) {
    next(err);
  }
};

const handleRemove = async (req, res, next) => {
  try {
    await livresService.deleteLivre(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const handleEmprunter = async (req, res, next) => {
  try {
    const emprunt = await livresService.emprunterLivre(Number(req.params.id), req.user.id);
    res.status(201).json(emprunt);
  } catch (err) {
    next(err);
  }
};

const handleRetourner = async (req, res, next) => {
  try {
    const emprunt = await livresService.retournerLivre(Number(req.params.id), req.user.id);
    res.json(emprunt);
  } catch (err) {
    next(err);
  }
};

module.exports = { handleGetAll, handleGetById, handleCreate, handleUpdate, handleRemove, handleEmprunter, handleRetourner };
