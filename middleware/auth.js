require("dotenv").config();
const jwt = require("jsonwebtoken");
const ApiError = require("./errors/ApiError");
const secretKey = process.env.JWT_SECRET;

const { authError, validationError } = ApiError;

module.exports = (req, res, next) => {
  let token = req.header("x-auth-token") || req.header("Authorization");

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Remove "Bearer " e pega o token real
  }

  if (!token) {
    return next(authError("Nenhum token encontrado, autorização necessária"));
  }

  try {
    // Verifica o token e extrai o payload
    const decoded = jwt.verify(token, secretKey);
    // Dá acesso ao token dentro da rota
    req.user = decoded.user;
    next();
  } catch (err) {
    next(validationError("Token inválido, autorização necessária"));
  }
};
