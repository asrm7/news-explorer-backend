require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const secretKey = process.env.JWT_SECRET;

const User = require('../models/user');
const { notFoundError, validationError, conflictError } = require('../middleware/errors/ApiError');

// @rota     GET /users/me
// @descrição Obtém o usuário logado (email, nome)
// @acesso   Privado
const getUser = async (req, res, next) => {
  try {
    // req.user vem do middleware de autenticação
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      next(notFoundError('Usuário não existe'));
    }
    res.json(user);
  } catch (err) {
    next(validationError('ID de usuário inválido'));
  } finally {
    next();
  }
};

// @rota     POST /signup
// @descrição Registra um usuário
// @acesso   Público
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(validationError({ error: errors.array() }));
  }

  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      next(conflictError('Usuário já existe'));
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSaltSync(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, secretKey, {
      expiresIn: '7d',
    }, (err) => {
      if (err) throw (err);
      res.send({ name, email });
    });
  } catch (err) {
    next();
  }
};

// @rota     POST /signin
// @descrição Autentica o usuário e retorna um token
// @acesso   Público
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(validationError({ errors: errors.array() }));
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(validationError('Credenciais inválidas'));
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(validationError('Credenciais inválidas'));
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, secretKey, {
      expiresIn: '7d',
    }, (err, token) => {
      if (err) throw (err);
      res.json({ token });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
};
