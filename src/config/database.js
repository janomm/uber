const mysql = require('mysql2/promise');
require('dotenv').config();

// Criando o pool de conexões com o banco de dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexões simultâneas abertas
    queueLimit: 0
});

// Função auxiliar para executar queries em qualquer parte do sistema
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Erro na execução da query:', error.message);
        throw error;
    }
}

// Testar a conexão ao iniciar a aplicação
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        connection.release(); // Devolve a conexão para o pool
    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error.message);
    }
})();

module.exports = {
    query,
    pool
};