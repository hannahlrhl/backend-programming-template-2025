const express = require('express');
const usersController = require('./controllers/users-controller');
const db = require('../../../models');
const { Users } = db;

const router = express.Router();

module.exports = (app) => {
  app.use('/users', router);

  router.get('/', usersController.getUsers);

  router.post('/', usersController.createUser);

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Users.findOne({ where: { email } });
      if (!user || user.password !== password) {
        return res.status(403).json({ message: 'INVALID_PASSWORD' });
      }
      res.json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/:id', usersController.getUser);

  router.put('/:id', usersController.updateUser);

  router.put('/:id/change-password', usersController.changePassword);

  router.delete('/:id', usersController.deleteUser);
};
