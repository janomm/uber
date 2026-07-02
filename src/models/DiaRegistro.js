const db = require('../config/database');

class DiaRegistro {
    static async criar(data_registro) {
        const sql = `INSERT INTO dias_registro (data_registro) VALUES (?)`;
        const resultado = await db.query(sql, [data_registro]);
        return resultado.insertId;
    }

    static async buscarPorData(data_registro) {
        const sql = `SELECT * FROM dias_registro WHERE data_registro = ?`;
        const linhas = await db.query(sql, [data_registro]);
        return linhas[0] || null;
    }

    static async obterRelatorioGeral() {
        const sql = `
            SELECT 
                d.id_dia,
                d.data_registro AS data,
                j.km_inicio, j.km_fim,
                (j.km_fim - j.km_inicio) AS km_rodados,
                j.hora_inicio, j.hora_fim,
                c.nome AS combustivel, j.id_combustivel,
                (j.internet_mb_fim - j.internet_mb_inicio) AS consumo_internet_mb,
                j.internet_mb_inicio, j.internet_mb_fim,
                m.valor_recebido, m.qtd_viagens, m.pontuacao, m.taxa_aceitacao, m.nota_final_dia
            FROM dias_registro d
            INNER JOIN jornadas_diarias j ON d.id_dia = j.id_dia
            INNER JOIN combustiveis c ON j.id_combustivel = c.id_combustivel
            INNER JOIN metricas_uber m ON d.id_dia = m.id_dia
            ORDER BY d.data_registro DESC
        `;
        return await db.query(sql);
    }

    // DELETE: Remove o dia e tudo atrelado a ele via CASCADE
    static async excluir(id_dia) {
        const sql = `DELETE FROM dias_registro WHERE id_dia = ?`;
        return await db.query(sql, [id_dia]);
    }
}

module.exports = DiaRegistro;