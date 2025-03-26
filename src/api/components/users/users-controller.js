const express = require('express');
const usersController = require('./controllers/users-controller');
const db = require('../../../models');
const { Users } = db;
const { errorResponder, errorTypes } = require('../../../core/errors');
const { hashPassword, passwordMatched } = require('../../../utils/password');

const router = express.Router();

module.exports = (app) => {
  app.use('/api/authentication', router);

  router.get('/users', usersController.getUsers);

  router.post('/users', usersController.createUser);

  router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(403).json({ message: 'INVALID_PASSWORD' });
      }
      
      const isPasswordValid = await passwordMatched(password, user.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: 'INVALID_PASSWORD' });
      }
      
      res.json({ message: 'Success' });
    } catch (error) {
      next(error);
    }
  });

  router.get('/users/:id', usersController.getUser);

  router.put('/users/:id', usersController.updateUser);

  router.put('/users/:id/change-password', usersController.changePassword);

  router.delete('/users/:id', usersController.deleteUser);
};

//no 2
const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/your_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const User = mongoose.model('User', new mongoose.Schema({ name: String }));
const Book = mongoose.model('Book', new mongoose.Schema({ title: String }));

app.get('/api/users', async (req, res) => {
    let offset = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;

    try {
        const users = await User.find().skip(offset).limit(limit);
        res.json({ users, offset, limit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/books', async (req, res) => {
    let offset = parseInt(req.query.offset) || 0;
    let limit = parseInt(req.query.limit) || 10;

    try {
        const books = await Book.find().skip(offset).limit(limit);
        res.json({ books, offset, limit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
