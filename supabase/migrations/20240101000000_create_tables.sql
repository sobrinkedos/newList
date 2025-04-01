-- Criação da extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Listas de Compras
CREATE TABLE IF NOT EXISTS listas_de_compras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  criado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Itens
CREATE TABLE IF NOT EXISTS itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(255),
  quantidade INTEGER NOT NULL DEFAULT 1,
  comprado BOOLEAN NOT NULL DEFAULT FALSE,
  lista_id UUID NOT NULL REFERENCES listas_de_compras(id) ON DELETE CASCADE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Compartilhamentos
CREATE TABLE IF NOT EXISTS compartilhamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lista_id UUID NOT NULL REFERENCES listas_de_compras(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  permissao VARCHAR(50) NOT NULL CHECK (permissao IN ('leitura', 'escrita')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lista_id, usuario_id)
);

-- Tabela: Receitas
CREATE TABLE IF NOT EXISTS receitas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  criado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Ingredientes de Receitas
CREATE TABLE IF NOT EXISTS ingredientes_de_receitas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receita_id UUID NOT NULL REFERENCES receitas(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES itens(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL DEFAULT 1,
  UNIQUE(receita_id, item_id)
);

-- Tabela: Localizações
CREATE TABLE IF NOT EXISTS localizacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação de índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_listas_criado_por ON listas_de_compras(criado_por);
CREATE INDEX IF NOT EXISTS idx_itens_lista_id ON itens(lista_id);
CREATE INDEX IF NOT EXISTS idx_compartilhamentos_lista_id ON compartilhamentos(lista_id);
CREATE INDEX IF NOT EXISTS idx_compartilhamentos_usuario_id ON compartilhamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_receitas_criado_por ON receitas(criado_por);
CREATE INDEX IF NOT EXISTS idx_ingredientes_receita_id ON ingredientes_de_receitas(receita_id);
CREATE INDEX IF NOT EXISTS idx_ingredientes_item_id ON ingredientes_de_receitas(item_id);
CREATE INDEX IF NOT EXISTS idx_localizacoes_usuario_id ON localizacoes(usuario_id);