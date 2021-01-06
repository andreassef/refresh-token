require('dotenv').config()

const app = require('./app');
const port = 3000;
require('./database');
require('./redis/blocklist-access-token');
require('./redis/allowlist-refresh-token');

const { InvalidArgumentError } = require('./src/erros');
const jwt = require('jsonwebtoken');

const routes = require('./rotas');

routes(app);

app.use((erro, request, response, next) => {
    let status = 500;
    const body = {
        message: erro.message
    }

    if (erro instanceof InvalidArgumentError) {
        status = 400
    }

    if (erro instanceof jwt.JsonWebTokenError) {
        status = 401
    }

    if (erro instanceof jwt.TokenExpiredError) {
        status = 401
        body.expiredAt = erro.expiredAt
    }

    response.status(status)
    response.json(body)
})

app.listen(port, () => console.log(`API ON na porta ${port}`));
