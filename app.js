const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const apiErrorHandler = require('./middleware/errors/apiErrorHandler');
const limiter = require('./middleware/limiter');
const dotenv = require("dotenv");
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middleware/logger');

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",  // Ou substitua com um domínio específico para maior segurança
  methods: "GET,POST,PATCH,PUT,DELETE", // métodos utilizados
  allowedHeaders: "Content-Type,Authorization", // cabeçalhos necessários
}));

app.use(helmet());

// Conecta ao banco de dados
mongoose
  .connect(process.env.CONNECTION)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Habilita se você estiver atrás de um proxy reverso (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', 1);

// Aplica o limitador a todas as requisições
app.use(limiter);

// Middleware de registro de requisições
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor irá cair agora');
  }, 0);
});

app.use(compression());

// Adiciona as rotas
app.use(routes);

// Habilita o logger de erros
app.use(errorLogger);

// Middleware de tratamento de erros
app.use(apiErrorHandler);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
