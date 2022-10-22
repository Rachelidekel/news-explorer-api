const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { createUser, login } = require('../controllers/users');
const {
  validateUserBody,
  validateAuthentication,
} = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthentication, login);

router.use(auth);
router.use('/users', usersRouter);
router.use('/articles', articlesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
