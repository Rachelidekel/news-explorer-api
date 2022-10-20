const Article = require('../models/article');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getArticles = (req, res, next) => {
  const owner = req.user;
  Article.find({ owner })
    .then((articles) => res.status(200).send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const owner = req.user;
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => res.status(201).send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(',')}`
          )
        );
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  const { id } = req.params;
  Article.findById(id)
    .orFail(() => {
      throw new NotFoundError('No article found with that id');
    })
    .then((article) => {
      if (!article.owner.equals(req.user)) {
        next(new ForbiddenError("You cannot delete someone else's article"));
      } else {
        Article.deleteOne(article).then(() => res.send(article));
      }
    })
    .catch(next);
};

module.exports = { getArticles, createArticle, deleteArticle };
