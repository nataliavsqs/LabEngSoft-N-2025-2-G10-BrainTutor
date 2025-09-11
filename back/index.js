const express = require("express");
const roteador = require("./roteador");
const {
    logarRequisicao,
    verificarToken
} = require("./intermediarios");
const {
    loginUsuario,
    recuperarSenha,
    novoCadastro
} = require("./controladores/usuarios");
const cors = require("cors");

const app = express();
const port = 8000;

// Middleware para permitir CORS
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware global para logar requisições
app.use(logarRequisicao);

// Rotas públicas (não precisam de autenticação)
app.post("/login", loginUsuario);
app.post("/recuperar-senha", recuperarSenha);
app.post("/cadastro", novoCadastro); // Cadastro sem necessidade de token

// Middleware para proteger rotas
// app.use(verificarToken);

// Rotas protegidas
app.use(roteador);

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});