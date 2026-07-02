# 🚗 Controle Diário para Motoristas de Aplicativo (Uber)

Sistema completo de gerenciamento e acompanhamento analítico diário voltado para motoristas de aplicativo. A ferramenta permite o controle logístico (quilometragem, horários e consumo de dados), monitoramento de insumos (combustível) e consolidação das métricas financeiras e de performance fornecidas pela plataforma Uber.

---

## 📐 Arquitetura do Sistema

O projeto foi desenvolvido seguindo as melhores práticas de engenharia de software, adotando uma **Arquitetura em Camadas** para garantir a separação de responsabilidades (SRP) e facilitar manutenções futuras.

* **View (Frontend):** Rápido e responsivo, construído com HTML5, JavaScript Vanilla (Fetch API) e estilizado via Tailwind CSS.
* **Controller:** Camada intermediária que valida as requisições HTTP, coordena o fluxo de dados e dita as regras de negócio.
* **Model:** Camada de persistência que isola as consultas SQL e interage diretamente com o Banco de Dados.
* **Config:** Centraliza variáveis de ambiente e gerencia o Pool de conexões do banco de dados para máxima performance.

---

## 🗄️ Modelagem do Banco de Dados (ER)

O banco de dados foi normalizado e dividido de forma a desacoplar a logística diária das métricas específicas da plataforma. Uma tabela âncora (`dias_registro`) unifica as informações, permitindo fácil expansão futura para um modelo multi-plataforma (ex: inclusão de métricas da 99 ou InDrive).

### Estrutura de Tabelas:
1.  **`combustiveis`**: Tabela auxiliar com os tipos de combustível disponíveis.
2.  **`dias_registro`**: Entidade central (âncora) baseada na data do calendário.
3.  **`jornadas_diarias`**: Registros de rodagem (KM), horários e consumo de internet (Relacionamento 1:1 com o Dia).
4.  **`metricas_uber`**: Dados financeiros, faturamento, aceitação e notas do app (Relacionamento 1:1 com o Dia).

> 💡 **Nota de Integridade:** As tabelas dependentes utilizam a restrição `ON DELETE CASCADE`. Se um dia for excluído, todos os seus dados logísticos e financeiros associados são limpos automaticamente.

---

## 📁 Estrutura de Arquivos

```text
meu-sistema-uber/
├── database/               # Scripts SQL estruturais e sementes (seeds)
│   ├── schema.sql          # Criação das tabelas e chaves estrangeiras
├── src/                    # Código-fonte da aplicação (Backend & Frontend)
│   ├── config/             # Instância e Pool do Banco de Dados
│   ├── models/             # Abstração de tabelas e queries SQL (CRUD)
│   ├── controllers/        # Validação e orquestração de rotas
│   ├── routes/             # Mapeamento dos Endpoints REST
│   └── views/              # Interface Gráfica do usuário (Dashboard e Form)
├── .env                    # Variáveis sensíveis e credenciais locais (Ignorado no Git)
├── .gitignore              # Filtro de arquivos protegidos/desnecessários para versionamento
├── server.js               # Ponto de entrada (Bootstrap) da aplicação Express
└── package.json            # Manifesto de dependências do Node.js
```

## 🗺️ Detalhamento dos Endpoints da API (REST)

Todas as requisições que enviam dados devem conter o cabeçalho `Content-Type: application/json`.

### 1. Registrar Novo Dia
* **Endpoint:** `/api/jornada`
* **Método:** `POST`
* **Descrição:** Salva de forma unificada os dados do dia, distribuindo as informações entre as tabelas correspondentes.
* **Corpo da Requisição (JSON):**
    ```json
    {
      "data_registro": "2026-07-01",
      "id_combustivel": 1,
      "km_inicio": 124500.0,
      "km_fim": 124720.5,
      "hora_inicio": "07:30:00",
      "hora_fim": "16:45:00",
      "internet_mb_inicio": 150.0,
      "internet_mb_fim": 420.5,
      "valor_recebido": 350.80,
      "qtd_viagens": 18,
      "pontuacao": 90,
      "taxa_aceitacao": 88.5,
      "nota_final_dia": 4.96
    }
    ```
* **Resposta de Sucesso (201 Created):**
    ```json
    {
      "success": true,
      "message": "Dados diários consolidados com sucesso!",
      "id_dia": 12
    }
    ```

### 2. Buscar Dados do Dashboard
* **Endpoint:** `/api/dashboard`
* **Método:** `GET`
* **Descrição:** Retorna o histórico completo calculando as métricas dinamicamente direto no banco (KM Rodados e Consumo de Internet).
* **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "id_dia": 12,
        "data": "2026-07-01T03:00:00.000Z",
        "km_inicio": "124500.0",
        "km_fim": "124720.5",
        "km_rodados": "220.5",
        "hora_inicio": "07:30:00",
        "hora_fim": "16:45:00",
        "combustivel": "Gasolina",
        "id_combustivel": 1,
        "consumo_internet_mb": "270.50",
        "internet_mb_inicio": "150.00",
        "internet_mb_fim": "420.50",
        "valor_recebido": "350.80",
        "qtd_viagens": 18,
        "pontuacao": 90,
        "taxa_aceitacao": "88.50",
        "nota_final_dia": "4.96"
      }
    ]
    ```

### 3. Atualizar Registro Existente
* **Endpoint:** `/api/jornada/:id`
* **Método:** `PUT`
* **Descrição:** Edita os registros operacionais e financeiros vinculados ao ID do dia enviado na URL.
* **Corpo da Requisição (JSON):** *(Mesma estrutura do POST, omitindo apenas o campo `data_registro` que é imutável)*.
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "success": true,
      "message": "Registro diário atualizado com sucesso!"
    }
    ```

### 4. Excluir Registro
* **Endpoint:** `/api/jornada/:id`
* **Método:** `DELETE`
* **Descrição:** Remove o dia selecionado e limpa todas as tabelas dependentes (Cascade).
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "success": true,
      "message": "Registro excluído com sucesso do sistema!"
    }
    ```

### 5. Listar Combustíveis
* **Endpoint:** `/api/combustiveis`
* **Método:** `GET`
* **Descrição:** Alimenta os elementos de seleção visual da interface.
* **Resposta de Sucesso (200 OK):**
    ```json
    [
      { "id_combustivel": 1, "nome": "Gasolina" },
      { "id_combustivel": 2, "nome": "Etanol" }
    ]
    ```
