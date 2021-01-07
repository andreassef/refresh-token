const controle = require('../controle-de-acesso');

const metodos = {
   ler: {
      todos: 'readAny',
      apenasSeu: 'readOwn'
   },
   criar: {
      todos: 'createAny',
      apenasSeu: 'createOwn'
   },
   remover: {
      todos: 'deleteAny',
      apenasSeu: 'deleteOwn'
   }
}

module.exports = (entidade, acao) =>
 (request, response, next) => {
    const permissoesDoCargo = controle.can(request.user.cargo)
    const acoes = metodos[acao]
    const permissaoTodos = permissoesDoCargo[acoes.todos](entidade)
    const permissaoApenasseu = permissoesDoCargo[acoes.apenasSeu](entidade)

    if(permissaoTodos.granted === false && permissaoApenasseu.granted === false) {
       response.status(403)
       response.end()
       return
    }

    request.acesso = {
       todos:{
          permitido: permissaoTodos.granted,
          atributos: permissaoTodos.attributes
       },
       apenasSeu: {
          permitido: permissaoApenasseu.granted,
          atributos: permissaoApenasseu.attributes
       }
    }
    next()
}