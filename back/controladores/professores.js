// const listaDeProfessores = require("../dados/professores");
// // const conexao = require('../conexao')





// function consultarProfessores(req, res) {
//     res.json(listaDeProfessores);
// };

// function consultarCodProfessor(req, res) {
//     const professor = listaDeProfessores.find(
//         (professor) => professor.idprofessor === Number(req.params.idConsulta)
//     );

//     if (!professor) {
//         return res.status(404).json({
//             message: "Professor não encontrado"
//         });
//     }

//     res.json(professor);
// };

// function validarProfessor(professor) {
//     // Verifica se professor e professor.body estão definidos
//     if (!professor || !professor.body) {
//         return "Dados do professor são obrigatórios";
//     }

//     if (!professor.body.nome) {
//         return "o campo nome é obrigatório";
//     }
//     if (!professor.body.tipo_usuario) {
//         return "o campo tipo de usuário é obrigatório";
//     }
//     if (!professor.body.email) {
//         return "o campo email é obrigatório";
//     }
//     if (typeof professor.body.nome !== "string") {
//         return "o campo 'nome' deve ser preenchido apenas com texto";
//     }
//     if (typeof professor.body.rg !== "number") {
//         return "o campo 'rg' deve ser preenchido apenas com numero";
//     }
//     if (typeof professor.body.telefone !== "number") {
//         return "o campo 'telefone' deve ser preenchido apenas com numero";
//     }
// }

// function novoProfessor(req, res) {
//     const erro = validarProfessor({ body: req.body });
//     if (erro) {
//         res.status(400).json({ erro });
//         return;
//     }

//     const novoId = listaDeProfessores.length ? listaDeProfessores[listaDeProfessores.length - 1].idprofessor + 1 : 1;

//     const novoProfessor = {
//         idprofessor: novoId, // Atribuição do novo ID
//         tipo_usuario: "professor",
//         nome: req.body.nome,
//         email: req.body.email,
//         rg: req.body.rg,
//         telefone: req.body.telefone,
//         endereco: req.body.endereco,
//         pais: req.body.pais
//     };

//     listaDeProfessores.push(novoProfessor); // Adiciona o novo professor à lista
//     res.status(201).json(novoProfessor); // Retorna o novo professor com status 201
// }



// function editarProfessor(req, res) {
//     const professor = listaDeProfessores.find(
//         (professor) => professor.idprofessor === Number(req.params.idConsulta)
//     );

//     // Verificar se o professor existe antes da validação
//     if (!professor) {
//         return res.status(404).json({ erro: "Professor não existe." });
//     }

//     // Validar dados com o objeto recém-criado, que permitirá a atualização parcial
//     const erro = validarProfessor({
//         body: {
//             nome: req.body.nome == professor.nome,
//             tipo_usuario: req.body.tipo_usuario == professor.tipo_usuario,
//             email: req.body.email == professor.email,
//             rg: req.body.rg == professor.rg,
//             telefone: req.body.telefone == professor.telefone,
//             endereco: req.body.endereco == professor.endereco,
//             pais: req.body.pais == professor.pais
//         }
//     });

//     if (erro) {
//         return res.status(400).json({ erro });
//     }

//     // Atualização dos dados se a validação passar
//     Object.assign(professor, req.body); // Atualiza os dados do professor com o corpo da requisição
//     return res.send("Alteração efetuada");
// }
// function substituirCadastroProf(req, res) {
//     const professor = listaDeProfessores.find(
//         (professor) => professor.idprofessor === Number(req.params.idConsulta)
//     );

//     if (!professor) {
//         return res.status(404).json({ message: "Professor não encontrado" });
//     }

//     // Validar os dados antes de atualizá-los
//     const erro = validarProfessor({ body: req.body });

//     if (erro) {
//         return res.status(400).json({ erro });
//     }

//     // Atualiza os dados do professor, se a validação for bem-sucedida
//     Object.assign(professor, req.body); // Atualiza os dados do professor
//     return res.json(professor); // Retorna o professor atualizado
// }

// function apagarCadProf(req, res) {

//     const professor = listaDeProfessores.find(
//         (professor) => professor.idprofessor === Number(req.params.idConsulta)
//     );
//     const indice = listaDeProfessores.indexOf(professor)

//     listaDeProfessores.splice(indice, 1)
//     res.send("cadastro apagado")
// }

// module.exports = {
//     consultarProfessores,
//     consultarCodProfessor,
//     novoProfessor,
//     editarProfessor,
//     substituirCadastroProf,
//     apagarCadProf
// };