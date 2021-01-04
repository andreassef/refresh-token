const autorizacao = require('./autorizacao')

module.exports = (entidade, acao) => 
    (request, response, next) => {
        if (request.isAuth === true) {
            return autorizacao(entidade, acao)(request, response, next)
        }

        next()
}
