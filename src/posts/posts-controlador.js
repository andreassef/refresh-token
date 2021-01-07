const Post = require('./posts-modelo');
const { InvalidArgumentError } = require('../erros');
const ConversorPost = require('../conversores')

module.exports = {
  async adiciona(req, res) {
    try {
      const post = new Post(req.body);
      await post.adiciona();

      res.status(201).json(post);
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        return res.status(400).json({ erro: erro.message });
      }
      res.status(500).json({ erro: erro.message });
    }
  },

  async lista(req, res) {
    try {
      let posts = await Post.lista();
      const conversor = new ConversorPost('json', req.acesso.todos.permitido ? req.acesso.todos.atributos : req.acesso.apenasSeu.atributos) // como segundo parametro, verificamos se o acesso a todos os atributos é permitido, caso posivito vamos listar todos os atributos
      if (!req.isAuth) {
        posts = posts.map(post => {
          post.conteudo = post.conteudo.substr(0, 10) + '... Voce precisa assinar o blog para ler o restante do post' 

          return post;
        })
      }

      res.send(conversor.converter(posts))
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
};
