const express = require('express');
const { check } = require('express-validator');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleController');
const auth = require('../middleware/auth');

const router = express.Router();

// @rota     GET /articles
// @descrição Obtém todos os artigos salvos pelo usuário
// @acesso   Privado
router.get('/', auth, getArticles);

// @rota     POST /articles
// @descrição Cria um artigo com as palavras-chave, título, texto, data, fonte, URL e imagem fornecidos
// @acesso   Privado
router.post('/',
  auth,
  [
    auth, [
      check('link', 'O link não é uma URL válida').isURL(),
      check('image', 'A imagem não é uma URL válida').isURL(),
      check('title', 'O título é obrigatório').not().isEmpty(),
      check('text', 'O texto é obrigatório').not().isEmpty(),
      check('date', 'A data é obrigatória').not().isEmpty(),
      check('source', 'A fonte é obrigatória').not().isEmpty(),
      check('keyword', 'A palavra-chave é obrigatória').not().isEmpty(),
    ],
  ], createArticle);

// @rota     DELETE /articles
// @descrição Deleta um artigo armazenado pelo _id
// @acesso   Privado
router.delete('/:articleId', auth, deleteArticle);

module.exports = router;
