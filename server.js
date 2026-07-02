const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importando as rotas da API
const apiRoutes = require('./src/routes/api.js');

const app = express();

// ==========================================
// MIDDLEWARES CONFIGURÁVEIS
// ==========================================

// Permite que requisições vindas de outras origens (como o seu frontend) acessem a API
app.use(cors());

// Configura o Express para interpretar requisições com o corpo em formato JSON
app.use(express.json());

// ==========================================
// DEFINIÇÃO DE ROTAS
// ==========================================

// Vincula todas as rotas criadas sob o prefixo '/api'
app.use('/api', apiRoutes);

// Rota de contingência para caminhos não encontrados (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`🔗 Dashboard disponível em: http://localhost:${PORT}/api/dashboard`);
});