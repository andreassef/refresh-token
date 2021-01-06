class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InvalidArgumentError';
  }
}

class InternalServerError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InternalServerError';
  }
}

class NotFoundEntity extends Error {
  constructor(entity) {
    const message = `Nao foi possível encontrar ${entity}`
    super(message)
    this.name = 'Nao encontrado'
  }
}

class NotAuthorized extends Error {
  constructor() {
    const message = 'Nao foi possível acessar esse recurso'
    super(message)
    this.name = 'Nao autorizado'
  }
}

module.exports = { InvalidArgumentError, InternalServerError, NotFoundEntity, NotAuthorized };
