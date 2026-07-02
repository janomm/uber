const DiaRegistro = require('../models/DiaRegistro');
const Combustivel = require('../models/Combustivel');

class RelatorioController {
    // Retorna a lista de todas as jornadas e métricas calculadas para o histórico/dashboard
    static async obterDashboard(req, res) {
        try {
            const relatorio = await DiaRegistro.obterRelatorioGeral();
            return res.status(200).json(relatorio);
        } catch (error) {
            console.error('Erro ao obter relatório:', error);
            return res.status(500).json({ error: 'Erro ao carregar os dados do dashboard.' });
        }
    }

    // Retorna a lista de combustíveis para carregar no <select> do formulário
    static async obterCombustiveis(req, res) {
        try {
            const combustiveis = await Combustivel.listarTodos();
            return res.status(200).json(combustiveis);
        } catch (error) {
            console.error('Erro ao listar combustíveis:', error);
            return res.status(500).json({ error: 'Erro ao carregar opções de combustível.' });
        }
    }
}

module.exports = RelatorioController;