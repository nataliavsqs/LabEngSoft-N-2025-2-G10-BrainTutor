const express = require("express");

const usuarios = require('./controladores/usuarios')
const {
    criarCurso
} = require('./controladores/usuarios');

const rotas = express();

// rotas.get("/professores", professores.consultarProfessores);
// rotas.get("/professores/:idConsulta", professores.consultarCodProfessor);
// rotas.post("/professores", professores.novoProfessor);
// rotas.patch("/professores/:idConsulta", professores.editarProfessor);
// rotas.put("/professores/:idConsulta", professores.substituirCadastroProf);
// rotas.delete("/professores/:idConsulta", professores.apagarCadProf);




// rotas.get("/alunos", alunos.consultarAlunos)
// rotas.post("/alunos", alunos.novoAluno);
// rotas.patch("/alunos/:idConsulta", alunos.editarAluno);
// rotas.delete("/alunos/:idConsulta", alunos.apagarCad);

rotas.get("/consultar", usuarios.consultarUsuarios);
rotas.get("/consultarprof", usuarios.consultarProfessores);
rotas.post('/cadastro', usuarios.novoCadastro);
rotas.patch('/editar/:id', usuarios.editarCadastro);
rotas.delete('/apagar/:id', usuarios.apagarCadastro);
rotas.post('/recuperar-senha', usuarios.recuperarSenha);
//login 
rotas.post('/login', usuarios.loginUsuario);

// Rota para criar um curso (somente professores)
rotas.post('/professores/:id/cursos', criarCurso);

module.exports = rotas;