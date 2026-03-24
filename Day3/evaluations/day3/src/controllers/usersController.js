const userService = require('../services/userService');

const handleGetAll = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const handleUpdateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await userService.updateRole(Number(req.params.id), role);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { handleGetAll, handleUpdateRole };