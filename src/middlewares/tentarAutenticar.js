const { middlewaresAutenticacao } = require('../usuarios')

module.exports = (request, response, next) => {
    request.isAuth = false;
    if (request.get('Authorization')) {
        return middlewaresAutenticacao.bearer(request, response, next)
    }

    next()
}