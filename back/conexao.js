const {
    Pool
} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'appbraintutor',
    password: process.env.DB_PASSWORD || 'nata12nina',
    port: process.env.DB_PORT || 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conexão bem-sucedida:', res.rows);
    }
});

module.exports = pool;