const { validationResult } = require('express-validator');
const { validationError, notFoundError, authError } = require('../middleware/errors/ApiError');
const Article = require('../models/article');

// @rota     GET /articles
// @descrição Obtém todos os artigos salvos pelo usuário
// @acesso   Privado
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    res.json(articles);
  } catch (err) {
    next();
  }
};

// @rota     POST /articles
// @descrição Cria um artigo com as palavras-chave, título, texto, data, fonte, URL e imagem fornecidos
// @acesso   Privado
const createArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(validationError({ errors: errors.array() }));
  }

  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  try {
    const newArticle = new Article({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user.id,
    });
    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    next(validationError('Não foi possível criar o artigo'));
  } finally {
    next();
  }
};

// @rota     DELETE /articles
// @descrição Deleta um artigo armazenado pelo _id
// @acesso   Privado
const mongoose = require('mongoose');

const deleteArticle = async (req, res, next) => {
  try {
    console.log('Parâmetros da requisição:', req.params);  // Verifica o ID recebido
    console.log('ID do usuário:', req.user.id);            // Verifica quem está tentando deletar
    const article = await Article.findById(req.params.articleId);

    if (!article) {
      return next(notFoundError('Artigo não encontrado'));
    }

    if (article.owner.toString() !== req.user.id) {
      return next(authError('Não autorizado a deletar este artigo'));
    }

    await Article.findByIdAndDelete(req.params.articleId);

    return res.json({ message: 'Artigo removido' });
  } catch (err) {
    console.error(err);
    return next(validationError('ID de artigo inválido'));
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
