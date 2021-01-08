const redis = require('redis');
const conexao = redis.createClient({prefix: 'passwordForgotten'})
const manipulaLista = require('./manipula-lista')
module.exports = manipulaLista(conexao) 