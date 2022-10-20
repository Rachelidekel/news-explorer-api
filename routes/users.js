const router = require('express').Router();
const { getCurrentUser } = require('../controllers/users');
const { validateObjId } = require('../middlewares/validation');

router.get('/me', validateObjId, getCurrentUser);

module.exports = router;
