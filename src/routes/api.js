const express = require('express');
const router = express.Router();

// Importando os controladores
const JornadaController = require('../controllers/JornadaController');
const RelatorioController = require('../controllers/RelatorioController');

// ==========================================
// ROTAS DE OPERAÇÃO (CRUD JORNADAS)
// ==========================================

// [CREATE] Salvar o fechamento completo do dia
// POST -> http://localhost:3000/api/jornada
router.post('/jornada', JornadaController.registrarDiaCompleto);

// [UPDATE] Editar os dados de um dia já salvo usando o ID do dia
// PUT -> http://localhost:3000/api/jornada/:id
router.put('/jornada/:id', JornadaController.atualizarDiaCompleto);

// [DELETE] Excluir um dia do sistema (apaga jornada e métricas via CASCADE)
// DELETE -> http://localhost:3000/api/jornada/:id
router.delete('/jornada/:id', JornadaController.excluirDiaCompleto);

// ==========================================
// ROTAS DE CONSULTA (RELATÓRIOS E FORMULÁRIOS)
// ==========================================

// [READ] Buscar o relatório geral para o Dashboard
// GET -> http://localhost:3000/api/dashboard
router.get('/dashboard', RelatorioController.obterDashboard);

// [READ] Listar os combustíveis para o formulário
// GET -> http://localhost:3000/api/combustiveis
router.get('/combustiveis', RelatorioController.obterCombustiveis);

module.exports = router;