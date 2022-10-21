const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          'The user with the provided email already exists'
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${err.name}: ${err.message}`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        {
          expiresIn: '7d',
        }
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Incorrect email or password'));
    });
};

const getCurrentUser = (req, res, next) => {
  const { user } = req;
  User.findById(user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user found with this Id');
      } else {
        return res.status(200).send({ user });
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
