const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'chave_secreta_padrao'; // Use uma variável de ambiente ou um valor padrão

function logarRequisicao(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    console.log("O corpo da mensagem é:", req.body);
    next();
}

function verificarToken(req, res, next) {
    const token = req.headers['authorization']; // O token deve ser enviado no cabeçalho Authorization

    if (!token) {
        return res.status(401).json({
            erro: 'Token de acesso não fornecido'
        });
    }

    // Remove o prefixo "Bearer " se estiver presente
    const tokenSemBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(tokenSemBearer, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                erro: 'Token inválido ou expirado'
            });
        }

        // Adiciona os dados do token decodificado ao objeto req
        req.usuario = decoded;
        next();
    });
}

module.exports = {
    verificarToken,
    logarRequisicao
};