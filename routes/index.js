const { check } = require('express-validator');
const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/userController');

// define rotas
const userRouter = require('./users');
const articleRouter = require('./articles');

// @rota     POST /signup
// @descrição Registra um usuário (nome, email, senha)
// @acesso   Público
router.use('/signup', [
  check('email', 'Por favor, inclua um email válido').isEmail(),
  check(
    'password',
    'Por favor, insira uma senha com 6 ou mais caracteres',
  ).isLength({ min: 6 }),
  check('name', 'Por favor, adicione um nome')
    .not()
    .isEmpty(),
], registerUser);

// @rota     POST /signin
// @descrição Autentica o usuário (email, senha) e retorna um token
// @acesso   Público
router.use('/signin', [
  check('email', 'Por favor, inclua um email válido').isEmail(),
  check('password', 'A senha é obrigatória').exists(),
], loginUser);

// Rotas privadas
router.use('/users', userRouter);
router.use('/articles', articleRouter);

module.exports = router;
