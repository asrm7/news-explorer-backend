const express = require('express');

const router = express.Router();
const { getUser } = require('../controllers/userController');

const auth = require('../middleware/auth');

// @rota     GET /users/me
// @descrição Obtém o usuário logado (email, nome)
// @acesso   Privado
router.get('/me', auth, getUser);

module.exports = router;
