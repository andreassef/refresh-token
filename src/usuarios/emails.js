const nodemailer = require('nodemailer');

const configuracaoEmailProducao = {
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_SENHA
    },
    secure: true,
}

const configuracaoEmailTeste = (contaTeste) => ({
    host: 'smtp.ethereal.email',
    auth: contaTeste,
})

async function criaConfiguracaoEmail() {
    if (process.env.NODE_ENV === 'production') {
        return configuracaoEmailProducao;
    } else {
        const contaTeste = await nodemailer.createTestAccount();
        return configuracaoEmailTeste(contaTeste);
    }
}

class Email {
    async enviaEmail() {
        const configuracaoEmail = await criaConfiguracaoEmail();
        const transportador = nodemailer.createTransport(configuracaoEmail);
    
        const info = await transportador.sendMail(this);
    
        if (process.env.NODE_ENV !== 'production') {
            console.log('URL: ' + nodemailer.getTestMessageUrl(info));
        }
    }
}

class EmailVerificacao extends Email {
    constructor( usuario, endereco ) {
        super();
        this.from = '"Blog do código" <noreply@blogdocodigo.com.br>';
        this.to = usuario.email
        this.subject = 'Verificacao de e-mail';
        this.text = `Olá, verifique seu e-mail aqui: ${endereco}`;
        this.html = `<h1>Olá</h1>, verifique seu e-mail aqui: <a href="${endereco}">${endereco}</a>`;
    }
}

class EmailRedefinicaoSenha extends Email {
    constructor( usuario, token) {
        super();
        this.from = '"Blog do código" <noreply@blogdocodigo.com.br>';
        this.to = usuario.email
        this.subject = 'Redefinicao de senha';
        this.text = `Olá, voce pediu para redefinir sua senha. Use o token a seguir para trocar a sua senha: ${token}`;
        this.html = `<h1>Olá</h1>, voce pediu para redefinir sua senha. Use o token a seguir para trocar a sua senha: <a href="${token}"> ${token}</a>`;
    }
}

module.exports = { EmailVerificacao, EmailRedefinicaoSenha };