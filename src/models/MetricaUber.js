const db = require('../config/database');

class MetricaUber {
    static async salvar(dados) {
        const { id_dia, valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia } = dados;
        const sql = `
            INSERT INTO metricas_uber 
                (id_dia, valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [id_dia, valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia];
        const resultado = await db.query(sql, params);
        return resultado.insertId;
    }

    // UPDATE: Atualiza o faturamento e notas do app
    static async atualizar(id_dia, dados) {
        const { valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia } = dados;
        const sql = `
            UPDATE metricas_uber 
            SET valor_recebido = ?, qtd_viagens = ?, pontuacao = ?, taxa_aceitacao = ?, nota_final_dia = ?
            WHERE id_dia = ?
        `;
        const params = [valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia, id_dia];
        return await db.query(sql, params);
    }
}

module.exports = MetricaUber;