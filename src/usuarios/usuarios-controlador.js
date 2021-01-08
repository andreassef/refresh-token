const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, NotFoundEntity } = require('../erros');

const tokens = require('./tokens');
const { EmailVerificacao, EmailRedefinicaoSenha } = require('./emails');
const {ConversorUsuario} = require('../conversores')

function geraEndereco(rota, token) {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}${rota}${token}`
}

module.exports = {
  async adiciona(req, res, next) {
    const { nome, email, senha, cargo } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
        cargo
      });
      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      const token  = tokens.verificaEmail.cria(usuario.id);
      const endereco = geraEndereco('/usuario/verifica_email/', token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail().catch(console.log);
      res.status(201).json(usuario);
    } catch (erro) {
        next(erro)
    }
  },

  async login(req, res, next) {
    try {
      const acessToken = tokens.access.cria(req.user.id);
      const refreshToken = await tokens.refresh.cria(req.user.id);
      res.set('Authorization', acessToken);
      res.status(200).json({refreshToken});
    } catch (erro) {
        next(erro)
    }
  },

  async logout(req, res, next) {
    try {
      const token = req.token;
      await tokens.access.invalida(token);
      res.status(204).json();
    } catch (erro) {
        next(erro)
    }
  },

  async lista(req, res, next) {
    try {
      const usuarios = await Usuario.lista();
      const conversorUsuario = new ConversorUsuario('json',
      req.acesso.todos.permitido? req.acesso.todos.atributos : req.acesso.apenasSeu.atributos
      )
      res.send(conversorUsuario.converter(usuarios));
    } catch (erro) {
        next(erro)
    }
  },

  async verificaEmail(req, res, next) {
    try {
      const usuario = req.user;
      await usuario.verificaEmail();
      res.status(200).json();
    } catch (erro) {
      next(erro)
    }
  },

  async deleta(req, res, next) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id);
      await usuario.deleta();
      res.status(200).json();
    } catch (erro) {
        next(erro);
    }
  },

  async forgotPassword(req, res, next) {
    const respostaPadrao = {mensagem: 'Se encontrarmos um usuário com esse email, vamos enviar uma mensagem com as instrucoes para redefinir sua senha'}
    try{
      const {email} = req.body;
      const user = await Usuario.buscaPorEmail(email);
      const token = await tokens.redefinirSenha.criarToken(user.id)
      const emailReset = new EmailRedefinicaoSenha(user, token)
      await emailReset.enviaEmail()
      res.send(respostaPadrao)
    }catch (e) {
      if (e instanceof NotFoundEntity) {
        res.send(respostaPadrao)
        return
      }
      next(e)
    }
  },

  async resetPassword(req, res, next) {
    try {
      if (typeof req.body.token !== 'string' || req.body.token.lenght === 0) {
        throw new InvalidArgumentError('O token está inválido')
      }
      const id = await tokens.redefinirSenha.verifica(req.body.token)
      const usuario = await Usuario.buscaPorId(id)
      await usuario.adicionaSenha(req.body.senha)
      await usuario.atualizaSenha()
      res.send({mensagem: 'Sua senha foi atualizada com sucesso!'})
    } catch(e) {
      next(e)
    }
  }
};
