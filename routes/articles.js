const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');
const {
  validateObjId,
  validateArticleBody,
} = require('../middlewares/validation');

router.get('/', getArticles);
router.post('/', validateArticleBody, createArticle);
router.delete('/:articleId', validateObjId, deleteArticle);

module.exports = router;
