const db = require('../config/database');

class JornadaDiaria {
    static async salvar(dados) {
        const { id_dia, km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim } = dados;
        const sql = `
            INSERT INTO jornadas_diarias 
                (id_dia, km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [id_dia, km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim];
        const resultado = await db.query(sql, params);
        return resultado.insertId;
    }

    // UPDATE: Atualiza os dados de rodagem e internet
    static async atualizar(id_dia, dados) {
        const { km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim } = dados;
        const sql = `
            UPDATE jornadas_diarias 
            SET km_inicio = ?, km_fim = ?, hora_inicio = ?, hora_fim = ?, id_combustivel = ?, internet_mb_inicio = ?, internet_mb_fim = ?
            WHERE id_dia = ?
        `;
        const params = [km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim, id_dia];
        return await db.query(sql, params);
    }
}

module.exports = JornadaDiaria;