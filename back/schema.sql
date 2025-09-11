-- drop database BrainTutor

-- Criação do banco de dados
CREATE DATABASE appbraintutor;
-- Importante: no PostgreSQL, você conecta ao banco criado com \c PlataformaEstudos ou via interface
-- Usar o banco (em SQL puro, isso não é usado; o comando é feito fora do SQL)
-- \c PlataformaEstudos

-- Tabela usuario (superclasse de aluno e professor)
CREATE TABLE usuario (
    idusuario SERIAL PRIMARY KEY,
    tipo_usuario VARCHAR(45) NOT NULL,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    rg VARCHAR(45),
    telefone VARCHAR(45),
    endereco VARCHAR(45),
    permissao VARCHAR(45),
    senha text NOT NULL
);

-- Tabela aluno (subclasse de usuario)
CREATE TABLE aluno (
    idaluno INT PRIMARY KEY,
    cursos_cadastrados INT,
    FOREIGN KEY (idaluno) REFERENCES usuario(idusuario)
);

-- Tabela Cursos
CREATE TABLE Cursos (
    idCurso SERIAL PRIMARY KEY,
    nome_curso VARCHAR(100),
    descricao_curso VARCHAR(255),
    carga_horaria VARCHAR(45)
);

-- Tabela professor (subclasse de usuario)
CREATE TABLE professor (
    idprofessor INT PRIMARY KEY,
    id_curso INT,
    formacao VARCHAR(100),
    informacoes_adicionais TEXT,
    disponibilidade VARCHAR(100),
    FOREIGN KEY (idprofessor) REFERENCES usuario(idusuario),
    FOREIGN KEY (id_curso) REFERENCES Cursos(idCurso)
);

-- Tabela Material
CREATE TABLE Material (
    idMaterial SERIAL PRIMARY KEY,
    titulo_material VARCHAR(100),
    descricao_material VARCHAR(255),
    id_curso INT,
    arquivo VARCHAR(100),
    id_autor INT,
    FOREIGN KEY (id_curso) REFERENCES Cursos(idCurso),
    FOREIGN KEY (id_autor) REFERENCES professor(idprofessor)
);

-- Tabela Pagamento (associação entre aluno e curso)
CREATE TABLE pagamento (
    idPagamento SERIAL PRIMARY KEY,
    idusuario INT,
    idCurso INT,
    tipoPagamento VARCHAR(45),
    FOREIGN KEY (idusuario) REFERENCES usuario(idusuario),
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso)
);

-- INSERT INTO aluno (idaluno, cursos_cadastrados) VALUES
-- (1, 2),
-- (2, 1);

-- -- Inserindo cursos
-- INSERT INTO Cursos (nome_curso, descricao_curso, carga_horaria) VALUES
-- ('JavaScript Básico', 'Introdução à programação com JS', '20h'),
-- ('PostgreSQL Avançado', 'Consultas e modelagem de dados', '30h');

-- -- Inserindo professores (vinculados aos usuários com tipo 'professor')
-- -- Carlos ensina JavaScript, Ana ensina PostgreSQL
-- INSERT INTO professor (idprofessor, id_curso, formacao, informacoes_adicionais, disponibilidade) VALUES
-- (3, 1, 'Ciência da Computação', 'Trabalha com desenvolvimento web há 5 anos', 'Seg a Sex - Noite'),
-- (4, 2, 'Engenharia da Computação', 'Experiência com bancos de dados', 'Seg a Sex - Manhã');

-- -- Inserindo materiais
-- INSERT INTO Material (titulo_material, descricao_material, id_curso, arquivo, id_autor) VALUES
-- ('Apostila JS', 'Material teórico sobre JS', 1, 'apostila-js.pdf', 3),
-- ('Exercícios PostgreSQL', 'Lista de exercícios práticos', 2, 'exercicios-pg.sql', 4);

-- -- Inserindo pagamentos (alunos pagando pelos cursos)
-- INSERT INTO pagamento (idusuario, idCurso, tipoPagamento) VALUES
-- (1, 1, 'cartao'),
-- (1, 2, 'pix'),
-- (2, 2, 'boleto');




