const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios');
const autorizacao = require('../middlewares/autorizacao');

module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor'])],
      postsControlador.adiciona
    );
};
