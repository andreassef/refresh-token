module.exports = (cargosObrigatorios) =>
 (request, response, next) => {
    
    if(cargosObrigatorios.indexOf(request.user.cargo) === -1) {
       response.status(403)
       response.end()
       return
    }
    next()
}