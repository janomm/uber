-- ===========================================================================
-- SCRIPT ATUALIZADO: CONTROLE DIÁRIO COM ENTIDADE DE DIA CENTRALIZADA
-- ===========================================================================

-- 1. Tabela Auxiliar: Tipos de Combustíveis
CREATE TABLE combustiveis (
    id_combustivel INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    CONSTRAINT pk_combustiveis PRIMARY KEY (id_combustivel)
);

-- 2. NOVA TABELA CENTRAL: Dias de Registro
-- Ela serve como a âncora que une a jornada e as métricas do mesmo dia
CREATE TABLE dias_registro (
    id_dia INT NOT NULL AUTO_INCREMENT,
    data_registro DATE NOT NULL,
    CONSTRAINT pk_dias_registro PRIMARY KEY (id_dia),
    CONSTRAINT uq_data_registro UNIQUE (data_registro) -- Impede duplicar o mesmo dia no sistema
);

-- 3. Tabela de Logística: Jornadas Diárias (Vinculada ao Dia)
CREATE TABLE jornadas_diarias (
    id_jornada INT NOT NULL AUTO_INCREMENT,
    id_dia INT NOT NULL,                                 -- Chave Estrangeira para o Dia
    km_inicio DECIMAL(10, 1) NOT NULL,
    km_fim DECIMAL(10, 1) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    id_combustivel INT NOT NULL,
    internet_mb_inicio DECIMAL(10, 2) NOT NULL,
    internet_mb_fim DECIMAL(10, 2) NOT NULL,
    CONSTRAINT pk_jornadas_diarias PRIMARY KEY (id_jornada),
    CONSTRAINT fk_jornadas_dia FOREIGN KEY (id_dia) 
        REFERENCES dias_registro (id_dia) ON DELETE CASCADE,
    CONSTRAINT uq_jornada_por_dia UNIQUE (id_dia),     -- Garante apenas 1 jornada por dia de registro
    CONSTRAINT fk_jornadas_combustivel FOREIGN KEY (id_combustivel) 
        REFERENCES combustiveis (id_combustivel)
);

-- 4. Tabela de Performance: Métricas Uber (Vinculada ao Dia)
CREATE TABLE metricas_uber (
    id_metrica INT NOT NULL AUTO_INCREMENT,
    id_dia INT NOT NULL,                                 -- Chave Estrangeira para o Dia
    valor_recebido DECIMAL(10, 2) NOT NULL,
    qtd_viagens INT NOT NULL,
    pontuacao INT NOT NULL,
    taxa_aceitacao DECIMAL(5, 2) NOT NULL,
    nota_final_dia DECIMAL(3, 2) NOT NULL,
    CONSTRAINT pk_metricas_uber PRIMARY KEY (id_metrica),
    CONSTRAINT fk_metricas_dia FOREIGN KEY (id_dia) 
        REFERENCES dias_registro (id_dia) ON DELETE CASCADE,
    CONSTRAINT uq_metricas_por_dia UNIQUE (id_dia)      -- Garante apenas 1 bloco de métricas Uber por dia
);

