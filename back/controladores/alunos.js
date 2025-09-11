// const listaDeAlunos = require("../dados/alunos");




// function validarAluno(aluno) {
//     // Verifica se aluno e aluno.body estão definidos
//     if (!aluno || !aluno.body) {
//         return "Dados do aluno são obrigatórios";
//     }

//     if (!aluno.body.nome) {
//         return "o campo nome é obrigatório";
//     }
//     if (!aluno.body.tipo_usuario) {
//         return "o campo tipo de usuário é obrigatório";
//     }
//     if (!aluno.body.email) {
//         return "o campo email é obrigatório";
//     }
//     if (typeof aluno.body.nome !== "string") {
//         return "o campo 'nome' deve ser preenchido apenas com texto";
//     }
//     if (typeof aluno.body.rg !== "number") {
//         return "o campo 'rg' deve ser preenchido apenas com numero";
//     }
//     if (typeof aluno.body.telefone !== "number") {
//         return "o campo 'telefone' deve ser preenchido apenas com numero";
//     }
// }

// function consultarAlunos(req, res) {
//     res.json(listaDeAlunos);
// };

// function novoAluno(req, res) {
//     const erro = validarAluno({
//         body: req.body
//     });
//     if (erro) {
//         res.status(400).json({
//             erro
//         });
//         return;
//     }

//     const novoId = listaDeAlunos.length ? listaDeAlunos[listaDeAlunos.length - 1].idAluno + 1 : 1;

//     const novoAluno = {
//         idaluno: novoId, // Atribuição do novo ID
//         tipo_usuario: "aluno",
//         nome: req.body.nome,
//         email: req.body.email,
//         rg: req.body.rg,
//         telefone: req.body.telefone,
//         endereco: req.body.endereco,
//         pais: req.body.pais
//     };

//     listaDeAlunos.push(novoAluno); // Adiciona o novo aluno à lista
//     res.status(201).json(novoAluno); // Retorna o novo aluno com status 201
// }



// function editarAluno(req, res) {
//     const aluno = listaDeAlunos.find(
//         (aluno) => aluno.idaluno === Number(req.params.idConsulta)
//     );

//     // Verificar se o aluno existe antes da validação
//     if (!aluno) {
//         return res.status(404).json({
//             erro: "aluno não existe."
//         });
//     }

//     // Validar dados com o objeto recém-criado, que permitirá a atualização parcial
//     const erro = validarAluno({
//         body: {
//             nome: req.body.nome == aluno.nome,
//             tipo_usuario: req.body.tipo_usuario == aluno.tipo_usuario,
//             email: req.body.email == aluno.email,
//             rg: req.body.rg == aluno.rg,
//             telefone: req.body.telefone == aluno.telefone,
//             endereco: req.body.endereco == aluno.endereco,
//             pais: req.body.pais == aluno.pais
//         }
//     });

//     if (erro) {
//         return res.status(400).json({
//             erro
//         });
//     }

//     // Atualização dos dados se a validação passar
//     Object.assign(aluno, req.body); // Atualiza os dados do aluno com o corpo da requisição
//     return res.send("Alteração efetuada");
// }

// function apagarCad(req, res) {

//     const aluno = listaDeAlunos.find(
//         (aluno) => aluno.idaluno === Number(req.params.idConsulta)
//     );
//     const indice = listaDeAlunos.indexOf(aluno)

//     listaDeAlunos.splice(indice, 1)
//     res.send("cadastro apagado")
// }





// module.exports = {
//     consultarAlunos,
//     novoAluno,
//     editarAluno,
//     apagarCad
// };