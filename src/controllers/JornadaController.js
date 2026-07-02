const DiaRegistro = require('../models/DiaRegistro');
const JornadaDiaria = require('../models/JornadaDiaria');
const MetricaUber = require('../models/MetricaUber');

class JornadaController {
    // [CREATE] Registra todo o fechamento do dia de uma vez só
    static async registrarDiaCompleto(req, res) {
        try {
            const {
                data_registro,
                km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim,
                valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia
            } = req.body;

            if (!data_registro || !km_inicio || !km_fim || !id_combustivel || valor_recebido === undefined) {
                return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
            }

            const diaExistente = await DiaRegistro.buscarPorData(data_registro);
            if (diaExistente) {
                return res.status(400).json({ error: 'Este dia já foi registrado no sistema.' });
            }

            const id_dia = await DiaRegistro.criar(data_registro);

            await JornadaDiaria.salvar({
                id_dia, km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim
            });

            await MetricaUber.salvar({
                id_dia, valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia
            });

            return res.status(201).json({ 
                success: true, 
                message: 'Dados diários consolidados com sucesso!',
                id_dia 
            });

        } catch (error) {
            console.error('Erro no controlador ao salvar jornada:', error);
            return res.status(500).json({ error: 'Erro interno ao salvar os dados do dia.' });
        }
    }

    // [UPDATE] Atualiza os dados de um dia existente
    static async atualizarDiaCompleto(req, res) {
        try {
            const { id } = req.params; // ID do dia que vem na URL (ex: /api/jornada/5)
            const {
                km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim,
                valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia
            } = req.body;

            if (!id || !km_inicio || !km_fim || !id_combustivel || valor_recebido === undefined) {
                return res.status(400).json({ error: 'Campos obrigatórios estão faltando para a atualização.' });
            }

            // 1. Atualiza a parte logística
            await JornadaDiaria.atualizar(id, {
                km_inicio, km_fim, hora_inicio, hora_fim, id_combustivel, internet_mb_inicio, internet_mb_fim
            });

            // 2. Atualiza a parte financeira/métrica
            await MetricaUber.atualizar(id, {
                valor_recebido, qtd_viagens, pontuacao, taxa_aceitacao, nota_final_dia
            });

            return res.status(200).json({ 
                success: true, 
                message: 'Registro diário atualizado com sucesso!' 
            });

        } catch (error) {
            console.error('Erro no controlador ao atualizar jornada:', error);
            return res.status(500).json({ error: 'Erro interno ao atualizar os dados.' });
        }
    }

    // [DELETE] Remove o dia e todas as dependências (via CASCADE no Banco de Dados)
    static async excluirDiaCompleto(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do registro não informado.' });
            }

            await DiaRegistro.excluir(id);

            return res.status(200).json({ 
                success: true, 
                message: 'Registro excluído com sucesso do sistema!' 
            });

        } catch (error) {
            console.error('Erro no controlador ao excluir jornada:', error);
            return res.status(500).json({ error: 'Erro interno ao excluir o registro.' });
        }
    }
}

module.exports = JornadaController;