class ConversorPost {
    constructor(tipoDeConteudo, camposExtras = []) {
        this.tipoDeConteudo = tipoDeConteudo
        this.camposPublicos = ['titulo', 'conteudo'].concat(camposExtras) //concatenaremos os campos publicos com os demais atributos que virao do construtor
    }

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

module.exports = ConversorPost