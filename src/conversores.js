class Conversor {
    converter (dados) {
        // Por padrao, o accesscontrol coloca um * quando usamos o readAny, portanto só vamos precisar filtrar se nao houver o *
        if (this.camposPublicos.indexOf('*') === -1) {
            dados = this.filtrar(dados)
        }

        if (this.tipoDeConteudo === 'json') {
            return this.json(dados)
        }
    }

    json(dados) {
        return JSON.stringify(dados)
    }

    filtrar (dados) {
        if(Array.isArray(dados)) {
            dados = dados.map((post) => this.filtrarObjetos(post))
        } else {
            dados = this.filtrarObjetos(dados)
        }
        return dados;
    }

    filtrarObjetos (objeto) {
        const objetoFiltrado = {}

        this.camposPublicos.forEach( (campo) => {
            if (Reflect.has(objeto, campo)) {
                objetoFiltrado[campo] = objeto[campo]
            }
        })
        return objetoFiltrado
    }
}

class ConversorPost extends Conversor {
    constructor(tipoDeConteudo, camposExtras = []) {
        super();
        this.tipoDeConteudo = tipoDeConteudo
        this.camposPublicos = ['titulo', 'conteudo'].concat(camposExtras) //concatenaremos os campos publicos com os demais atributos que virao do construtor
    }
}

class ConversorUsuario extends Conversor {
    constructor(tipoDeConteudo, camposExtras = []) {
        super()
        this.tipoDeConteudo = tipoDeConteudo
        this.camposPublicos = ['nome'].concat(camposExtras) //concatenaremos os campos publicos com os demais atributos que virao do construtor
    }
}

module.exports = { ConversorPost, ConversorUsuario}