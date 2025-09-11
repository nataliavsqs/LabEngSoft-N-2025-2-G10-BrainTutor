const conexao = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'chave_secreta_padrao';

const pwd = securePassword();

function validarUsuario(usuario) {
    if (!usuario || !usuario.body) {
        return "Dados do usuario são obrigatórios";
    }

    if (!usuario.body.nome) {
        return "o campo nome é obrigatório";
    }
    if (!usuario.body.tipo_usuario) {
        return "o campo tipo de usuário é obrigatório";
    }
    if (!usuario.body.email) {
        return "o campo email é obrigatório";
    }
    if (typeof usuario.body.nome !== "string") {
        return "o campo 'nome' deve ser preenchido apenas com texto";
    }
    if (typeof usuario.body.rg !== "string") {
        return "o campo 'rg' deve ser preenchido apenas com numero";
    }
    if (typeof usuario.body.telefone !== "string") {
        return "o campo 'telefone' deve ser preenchido apenas com numero";
    }
    if (!usuario.body.senha) {
        return "o campo 'senha' deve ser preenchido";
    }

    // Adicionar regras de senha
    const senha = usuario.body.senha;
    if (senha.length < 6) {
        return "A senha deve ter pelo menos 6 caracteres";
    }
    if (!/[A-Z]/.test(senha)) {
        return "A senha deve conter pelo menos uma letra maiúscula";
    }
    if (!/[a-z]/.test(senha)) {
        return "A senha deve conter pelo menos uma letra minúscula";
    }
    if (!/[0-9]/.test(senha)) {
        return "A senha deve conter pelo menos um número";
    }
}




const novoCadastro = async (req, res) => {
    const erro = validarUsuario({
        body: req.body
    });
    if (erro) {
        res.status(400).json({
            erro
        });
        return;
    }

    const {
        nome,
        rg,
        telefone,
        email,
        endereco,
        tipo_usuario,
        senha,
        id_curso,
        formacao,
        informacoes_adicionais,
        disponibilidade
    } = req.body;

    // Verifica se o email ou o RG já existem
    try {
        const {
            rowCount: emailExiste
        } = await conexao.query(
            'SELECT 1 FROM usuario WHERE email = $1',
            [email]
        );

        if (emailExiste > 0) {
            return res.status(400).json({
                erro: 'O email já está em uso. Por favor, use outro email.'
            });
        }

        const {
            rowCount: rgExiste
        } = await conexao.query(
            'SELECT 1 FROM usuario WHERE rg = $1',
            [rg]
        );

        if (rgExiste > 0) {
            return res.status(400).json({
                erro: 'O RG já está em uso. Por favor, use outro RG.'
            });
        }
    } catch (error) {
        console.error('Erro ao verificar email ou RG:', error);
        return res.status(500).json({
            erro: 'Erro ao verificar email ou RG',
            detalhes: error.message
        });
    }

    // Verifica o tipo de usuário e define a permissão
    let permissao;
    if (tipo_usuario === 'professor') {
        permissao = 'admin';
    } else if (tipo_usuario === 'aluno') {
        permissao = 'leitura';
    } else {
        return res.status(400).json({
            erro: 'Tipo de usuário inválido. Use "professor" ou "aluno".'
        });
    }

    try {
        // Criptografa a senha
        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
        const {
            rows: [novoUsuario]
        } = await conexao.query(
            'INSERT INTO usuario (nome, rg, telefone, email, tipo_usuario, endereco, permissao, senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [nome, rg, telefone, email, tipo_usuario, endereco, permissao, hash]
        );

        // Se o tipo de usuário for professor, insere na tabela professor
        if (tipo_usuario === 'professor') {
            await conexao.query(
                'INSERT INTO professor (idprofessor, id_curso, formacao, informacoes_adicionais, disponibilidade) VALUES ($1, $2, $3, $4, $5)',
                [novoUsuario.idusuario, id_curso, formacao, informacoes_adicionais, disponibilidade]
            );
        }

        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({
            erro: 'Erro ao cadastrar usuário',
            detalhes: error.message
        });
    }
};


const consultarProfessores = async (req, res) => {
    try {
        const {
            rows: professores
        } = await conexao.query(
            `SELECT 
                usuario.idusuario AS idprofessor,
                usuario.nome,
                usuario.email,
                usuario.telefone,
                professor.id_curso,
                professor.formacao,
                professor.informacoes_adicionais,
                professor.disponibilidade
            FROM usuario
            LEFT JOIN professor ON usuario.idusuario = professor.idprofessor
            WHERE usuario.tipo_usuario = 'professor'`
        );

        res.json(professores);
    } catch (error) {
        console.error('Erro ao consultar professores:', error);
        res.status(500).json({
            erro: 'Erro ao consultar professores',
            detalhes: error.message
        });
    }
};

const consultarUsuarios = async (req, res) => {
    try {
        const {
            rows: usuarios
        } = await conexao.query(
            'SELECT * FROM usuario'
        );
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao consultar usuarios:', error);
        res.status(500).json({
            erro: 'Erro ao consultar usuarios',
            detalhes: error.message
        });
    }
}


const editarCadastro = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        nome,
        rg,
        telefone,
        email,
        endereco,
        senha,
        id_curso,
        formacao,
        informacoes_adicionais,
        disponibilidade
    } = req.body;

    try {
        // Verifica se o usuário com o ID existe
        const {
            rows: [usuario]
        } = await conexao.query(
            'SELECT * FROM usuario WHERE idusuario = $1',
            [id]
        );

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        console.log('ID do professor:', id);

        const {
            rowCount
        } = await conexao.query(
            'SELECT 1 FROM professor WHERE idprofessor = $1',
            [id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                erro: 'Professor não encontrado na tabela professor'
            });
        }

        // Criptografa a senha, se fornecida
        let hashSenha = null;
        if (senha) {
            try {
                hashSenha = (await pwd.hash(Buffer.from(senha))).toString('hex');
            } catch (error) {
                console.error('Erro ao criptografar a senha:', error);
                return res.status(500).json({
                    erro: 'Erro ao criptografar a senha',
                    detalhes: error.message
                });
            }
        }

        // Atualiza os dados básicos do usuário
        await conexao.query(
            `UPDATE usuario 
             SET nome = $1, rg = $2, telefone = $3, email = $4, endereco = $5, senha = COALESCE($6, senha) 
             WHERE idusuario = $7`,
            [nome, rg, telefone, email, endereco, hashSenha, id]
        );

        // Se o usuário for do tipo professor, atualiza os campos específicos de professor
        if (usuario.tipo_usuario === 'professor') {
            const updates = [];
            const values = [];
            let index = 1;

            if (id_curso !== undefined) {
                updates.push(`id_curso = $${index++}`);
                values.push(id_curso);
            }
            if (formacao !== undefined) {
                updates.push(`formacao = $${index++}`);
                values.push(formacao);
            }
            if (informacoes_adicionais !== undefined) {
                updates.push(`informacoes_adicionais = $${index++}`);
                values.push(informacoes_adicionais);
            }
            if (disponibilidade !== undefined) {
                updates.push(`disponibilidade = $${index++}`);
                values.push(disponibilidade);
            }

            if (updates.length > 0) {
                values.push(id); // Adiciona o ID do professor como último parâmetro
                await conexao.query(
                    `UPDATE professor 
                     SET ${updates.join(', ')} 
                     WHERE idprofessor = $${index}`,
                    values
                );
            }
        }

        res.json({
            mensagem: 'Cadastro atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao editar cadastro:', error);
        res.status(500).json({
            erro: 'Erro ao editar cadastro',
            detalhes: error.message
        });
    }
};

const apagarCadastro = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const {
            rowCount
        } = await conexao.query(
            'DELETE FROM usuario WHERE idusuario = $1',
            [id]
        );

        if (rowCount === 0) {
            return res.status(404).json({
                erro: 'Professor não encontrado'
            });
        }

        res.json({
            mensagem: 'Cadastro apagado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao apagar cadastro:', error);
        res.status(500).json({
            erro: 'Erro ao apagar cadastro',
            detalhes: error.message
        });
    }
};


const loginUsuario = async (req, res) => {
    const {
        email,
        senha
    } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            erro: 'Email e senha são obrigatórios'
        });
    }

    try {
        const {
            rows: [usuario]
        } = await conexao.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );

        if (!usuario) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos'
            });
        }

        const resultado = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, 'hex'));

        if (resultado === securePassword.INVALID_UNRECOGNIZED_HASH) {
            return res.status(401).json({
                erro: 'Senha inválida'
            });
        } else if (resultado === securePassword.VALID) {
            const token = jwt.sign({
                    id: usuario.idusuario,
                    tipo_usuario: usuario.tipo_usuario
                },
                jwtSecret, // Use a variável jwtSecret
                {
                    expiresIn: '1h'
                }
            );
            return res.status(200).json({
                mensagem: 'Login bem-sucedido',
                token: token
            });

        } else if (resultado === securePassword.VALID_NEEDS_REHASH) {
            const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
            await conexao.query(
                'UPDATE usuario SET senha = $1 WHERE idusuario = $2',
                [hash, usuario.idusuario]
            );
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            erro: 'Erro ao fazer login',
            detalhes: error.message
        });
    }
};

const recuperarSenha = async (req, res) => {
    const {
        email,
        rg
    } = req.body;

    if (!email || !rg) {
        return res.status(400).json({
            erro: 'Email e RG são obrigatórios'
        });
    }

    try {
        const {
            rows: [usuario]
        } = await conexao.query(
            'SELECT * FROM usuario WHERE email = $1 AND rg = $2',
            [email, rg]
        );

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado com os dados fornecidos'
            });
        }

        const novaSenha = Math.random().toString(36).slice(-8);
        const hashSenha = (await pwd.hash(Buffer.from(novaSenha))).toString('hex');

        await conexao.query(
            'UPDATE usuario SET senha = $1 WHERE idusuario = $2',
            [hashSenha, usuario.idusuario]
        );

        res.json({
            mensagem: 'Senha recuperada com sucesso. Use a nova senha para acessar sua conta.',
            novaSenha
        });
    } catch (error) {
        console.error('Erro ao recuperar senha:', error);
        res.status(500).json({
            erro: 'Erro ao recuperar senha',
            detalhes: error.message
        });
    }
};

const criarCurso = async (req, res) => {
    const {
        id
    } = req.params; // ID do professor
    const {
        nome_curso,
        descricao_curso,
        carga_horaria
    } = req.body;

    // Valida os campos obrigatórios
    if (!nome_curso || !descricao_curso || !carga_horaria) {
        return res.status(400).json({
            erro: 'Os campos nome_curso, descricao_curso e carga_horaria são obrigatórios.'
        });
    }

    try {
        // Verifica se o professor existe
        const {
            rowCount: professorExiste
        } = await conexao.query(
            'SELECT 1 FROM professor WHERE idprofessor = $1',
            [id]
        );

        if (professorExiste === 0) {
            return res.status(404).json({
                erro: 'Professor não encontrado. Apenas professores podem criar cursos.'
            });
        }

        // Insere o curso na tabela Cursos
        const {
            rows: [novoCurso]
        } = await conexao.query(
            'INSERT INTO Cursos (nome_curso, descricao_curso, carga_horaria) VALUES ($1, $2, $3) RETURNING *',
            [nome_curso, descricao_curso, carga_horaria]
        );

        res.status(201).json({
            mensagem: 'Curso criado com sucesso.',
            curso: novoCurso
        });
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        res.status(500).json({
            erro: 'Erro ao criar curso',
            detalhes: error.message
        });
    }
};

module.exports = {
    consultarProfessores,
    editarCadastro,
    novoCadastro,
    apagarCadastro,
    consultarUsuarios,
    loginUsuario,
    recuperarSenha,
    criarCurso
};