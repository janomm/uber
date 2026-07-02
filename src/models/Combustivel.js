const db = require('../config/database');

class Combustivel {
    static async listarTodos() {
        const sql = `SELECT id_combustivel, nome FROM combustiveis ORDER BY nome ASC`;
        return await db.query(sql);
    }

    static async buscarPorId(id_combustivel) {
        const sql = `SELECT * FROM combustiveis WHERE id_combustivel = ?`;
        const linhas = await db.query(sql, [id_combustivel]);
        return linhas[0] || null;
    }

    static async criar(nome) {
        const sql = `INSERT INTO combustiveis (nome) VALUES (?)`;
        const resultado = await db.query(sql, [nome]);
        return resultado.insertId;
    }

    // UPDATE: Altera o nome de um combustível
    static async atualizar(id_combustivel, nome) {
        const sql = `UPDATE combustiveis SET nome = ? WHERE id_combustivel = ?`;
        return await db.query(sql, [nome, id_combustivel]);
    }

    // DELETE: Remove o combustível
    static async excluir(id_combustivel) {
        const sql = `DELETE FROM combustiveis WHERE id_combustivel = ?`;
        return await db.query(sql, [id_combustivel]);
    }
}

module.exports = Combustivel;