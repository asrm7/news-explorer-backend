# Aplicativo News Explorer

Este projeto é um serviço onde os usuários podem pesquisar artigos de notícias e salvá-los em seus perfis.

O aplicativo pode ser executado em "https://news-explorer-backend-m2lm.onrender.com" e acessará a API em <>

## Sobre o Projeto
Este site possui as seguintes funcionalidades principais:

Quando um usuário insere uma palavra-chave na barra de pesquisa, uma solicitação é feita ao serviço News API, onde são encontrados todos os artigos relevantes da última semana e exibida uma lista de cartões para cada um deles.

Se um usuário cria uma conta, ele tem a capacidade de salvar e exibir os artigos que salvou em uma seção especial do site.

### Front-End
O site consiste em 2 páginas: a página inicial onde os usuários podem pesquisar artigos de notícias recentes, e uma página de notícias salvas que está disponível apenas para usuários logados. Existem 3 janelas pop-up: registro, sucesso de registro e login. Repositório Front-End: <>

#### Recursos de Tecnologia do Back-End
O back-end é uma API RESTful construída com Express.jse MongoDB. A infraestrutura para hospedar o código de produção foi lançada no servidor em nuvem AWS.

Duas entidades foram criadas neste projeto: usuário e artigo.

As seguintes 4 rotas estão incluídas para artigo:
# retorna informações sobre o usuário logado (email e nome)
GET /users/me

# retorna todos os artigos salvos pelo usuário
GET /articles

# cria um artigo com a palavra-chave, título, texto, data, fonte, link e imagem passados no corpo
POST /articles

# exclui o artigo armazenado pelo _id
DELETE /articles/articleId

# cria um usuário com o email, senha e nome passados no corpo
POST /signup

# verifica o email e a senha passados no corpo e retorna um JWT
POST /signin
