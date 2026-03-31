-- ============================================================
-- CRM ALHAMBRA — Schema Completo para Supabase
-- ⚠️  APAGA e RECRIA todas as tabelas do zero
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- Dropar tabelas na ordem correta (dependências primeiro)
DROP TABLE IF EXISTS atividades CASCADE;
DROP TABLE IF EXISTS tarefas CASCADE;
DROP TABLE IF EXISTS viabilidades CASCADE;
DROP TABLE IF EXISTS contratos CASCADE;
DROP TABLE IF EXISTS oportunidades CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== TABELA: USUARIOS ====================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  perfil TEXT CHECK (perfil IN ('gestor', 'comercial', 'cs', 'tecnico', 'admin')) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TABELA: CLIENTES ====================
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  operadora_atual TEXT,
  notas TEXT,
  responsavel_tecnico_email TEXT,
  responsavel_tecnico_telefone TEXT,
  responsavel_financeiro_email TEXT,
  responsavel_financeiro_telefone TEXT,
  responsavel_comercial_email TEXT,
  responsavel_comercial_telefone TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==================== TABELA: OPORTUNIDADES ====================
CREATE TABLE oportunidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  empresa TEXT NOT NULL,
  solicitante TEXT,
  email TEXT,
  endereco TEXT,
  coordenadas TEXT,
  velocidade TEXT,
  produto TEXT CHECK (produto IN ('fibra','radio','fibra_radio','backup','firewall','cloud','storage','telefonia_ip')) NOT NULL,
  valor_mensal NUMERIC(10,2),
  tempo_contrato INTEGER,
  etapa TEXT CHECK (etapa IN ('prospecção','previsões','proposta','negociação','ganho','perda')) DEFAULT 'prospecção',
  observacoes TEXT,
  responsavel_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==================== TABELA: CONTRATOS ====================
CREATE TABLE contratos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  empresa TEXT NOT NULL,
  cnpj TEXT,
  endereco_instalacao TEXT,
  produto TEXT CHECK (produto IN ('fibra','radio','fibra_radio','backup','firewall','cloud','storage','telefonia_ip')) NOT NULL,
  valor_mensal NUMERIC(10,2),
  data_assinatura DATE,
  data_ativacao DATE,
  prazo_meses INTEGER,
  status TEXT CHECK (status IN ('ativo','prestes_a_vencer')) DEFAULT 'ativo',
  protegido BOOLEAN DEFAULT true,
  renovacao_automatica BOOLEAN DEFAULT false,
  multa_rescisao TEXT CHECK (multa_rescisao IN ('30%','50%')) DEFAULT '30%',
  responsavel_tecnico_nome TEXT,
  responsavel_tecnico_email TEXT,
  responsavel_tecnico_telefone TEXT,
  responsavel_financeiro_nome TEXT,
  responsavel_financeiro_email TEXT,
  responsavel_financeiro_telefone TEXT,
  responsavel_comercial_nome TEXT,
  responsavel_comercial_email TEXT,
  responsavel_comercial_telefone TEXT,
  responsavel_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==================== TABELA: VIABILIDADES ====================
CREATE TABLE viabilidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  endereco TEXT NOT NULL,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  tipo_conexao TEXT CHECK (tipo_conexao IN ('fibra','radio','fibra_radio','backup','firewall','cloud','storage','telefonia_ip')) NOT NULL,
  velocidade TEXT,
  prazo TEXT,
  operadora_atual TEXT,
  imagem_url TEXT,
  equipamentos TEXT,
  metragem TEXT,
  motivo TEXT CHECK (motivo IN ('upsell','crossell','mudanca_endereco','novo_cliente','retencao')),
  rede TEXT CHECK (rede IN ('on_net','off_net')),
  status_analise TEXT CHECK (status_analise IN ('pendente','aprovado','rejeitado')) DEFAULT 'pendente',
  analisado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  analisado_em TIMESTAMPTZ,
  notas_analise TEXT,
  custo_instalacao NUMERIC(10,2),
  aprovado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  aprovado_em TIMESTAMPTZ,
  notas_aprovacao TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==================== TABELA: TAREFAS ====================
CREATE TABLE tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oportunidade_id UUID REFERENCES oportunidades(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('ligacao','reuniao','email','proposta','contrato')) DEFAULT 'ligacao',
  status TEXT CHECK (status IN ('aberta','em_progresso','concluida','cancelada')) DEFAULT 'aberta',
  prioridade TEXT CHECK (prioridade IN ('baixa','media','alta','urgente')) DEFAULT 'media',
  data_vencimento TIMESTAMPTZ,
  atribuido_a UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==================== TABELA: ATIVIDADES ====================
CREATE TABLE atividades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oportunidade_id UUID REFERENCES oportunidades(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  tipo TEXT CHECK (tipo IN ('ligacao','reuniao','email','proposta','contrato')) NOT NULL,
  data_atividade TIMESTAMPTZ NOT NULL,
  duracao_minutos INTEGER,
  participantes TEXT,
  assunto TEXT,
  notas TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ==================== TABELA: PRODUTOS ====================
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('fibra','radio','fibra_radio','backup','firewall','cloud','storage','telefonia_ip')) NOT NULL,
  preco_base NUMERIC(10,2),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ÍNDICES ====================
CREATE INDEX idx_oportunidades_etapa ON oportunidades(etapa);
CREATE INDEX idx_oportunidades_responsavel ON oportunidades(responsavel_id);
CREATE INDEX idx_oportunidades_cliente ON oportunidades(cliente_id);
CREATE INDEX idx_contratos_cliente ON contratos(cliente_id);
CREATE INDEX idx_contratos_status ON contratos(status);
CREATE INDEX idx_tarefas_status ON tarefas(status);
CREATE INDEX idx_tarefas_atribuido ON tarefas(atribuido_a);
CREATE INDEX idx_atividades_oportunidade ON atividades(oportunidade_id);
CREATE INDEX idx_viabilidades_status ON viabilidades(status_analise);

-- ==================== RLS ====================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE viabilidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para anon key (ajustar para produção)
CREATE POLICY "anon_all" ON usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON oportunidades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON contratos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON viabilidades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON tarefas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON atividades FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON produtos FOR ALL USING (true) WITH CHECK (true);

-- ==================== DADOS INICIAIS: USUARIOS ====================
INSERT INTO usuarios (id, nome, email, perfil, ativo) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Carlos Almeida', 'carlos@alhambra.com', 'gestor', true),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Ana Silva', 'ana@alhambra.com', 'comercial', true),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Bruno Costa', 'bruno@alhambra.com', 'comercial', true),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Lucia Martins', 'lucia@alhambra.com', 'cs', true),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'Pedro Souza', 'pedro@alhambra.com', 'tecnico', true);

-- ==================== DADOS INICIAIS: PRODUTOS ====================
INSERT INTO produtos (nome, descricao, tipo, preco_base, ativo) VALUES
  ('Fibra 100 Mbps', 'Link dedicado 100 Mbps simétrico', 'fibra', 800, true),
  ('Fibra 200 Mbps', 'Link dedicado 200 Mbps simétrico', 'fibra', 1500, true),
  ('Fibra 500 Mbps', 'Link dedicado 500 Mbps simétrico', 'fibra', 2500, true),
  ('Fibra 1 Gbps', 'Link dedicado 1 Gbps simétrico', 'fibra', 5000, true),
  ('Rádio 50 Mbps', 'Link rádio 50 Mbps', 'radio', 500, true),
  ('Rádio 100 Mbps', 'Link rádio 100 Mbps', 'radio', 900, true),
  ('Fibra+Rádio 200 Mbps', 'Link redundante fibra + rádio', 'fibra_radio', 2200, true),
  ('Backup Diário 500 GB', 'Backup em nuvem com retenção 30 dias', 'backup', 350, true),
  ('Firewall UTM', 'Firewall gerenciado com IDS/IPS', 'firewall', 600, true),
  ('Cloud Server 4 vCPU', 'Servidor virtual 4 vCPU, 8 GB RAM', 'cloud', 450, true),
  ('Storage 1 TB', 'Armazenamento corporativo 1 TB', 'storage', 280, true),
  ('Telefonia IP 10 Ramais', 'Central PABX IP com 10 ramais', 'telefonia_ip', 400, true);

-- ==================== DADOS INICIAIS: CLIENTES ====================
INSERT INTO clientes (nome, email, telefone, endereco, cidade, estado, cep, operadora_atual, notas) VALUES
  ('TechCorp Ltda', 'contato@techcorp.com', '(41) 3333-1111', 'Rua XV de Novembro, 100', 'Curitiba', 'PR', '80020-310', 'Vivo', 'Cliente potencial grande'),
  ('Indústria Paraná S.A.', 'ti@indparana.com', '(41) 3333-2222', 'Av. Comendador Franco, 500', 'Curitiba', 'PR', '80215-090', 'Claro', ''),
  ('Hospital Santa Cruz', 'infra@hsc.com', '(41) 3333-3333', 'Rua Padre Anchieta, 200', 'Curitiba', 'PR', '80410-030', 'Oi', 'Necessita alta disponibilidade');

-- ============================================================
-- ✅ PRONTO! Tabelas criadas com sucesso.
-- Abra o CRM e ele vai conectar automaticamente.
-- ============================================================
