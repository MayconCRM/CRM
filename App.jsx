import { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts";
import { Search, Menu, X, ChevronDown, ChevronRight, Plus, Edit2, Trash2, Eye, Filter, Download, Upload, Phone, Mail, Calendar, Clock, Users, FileText, Settings, BarChart3, Home, Target, Briefcase, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Activity, Wifi, Radio, MapPin, Star, MoreVertical, ArrowRight, GripVertical, LogOut, Moon, Sun, Bell, User, Shield, Zap, Globe, Building2, CircleDot, Hash, ArrowUpDown, RefreshCw, PieChart as PieChartIcon, FileSpreadsheet, ChevronLeft, Loader2, CloudOff, Cloud } from "lucide-react";

// ==================== SUPABASE REST CLIENT ====================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://gazpxrinfxzxjucxcpwp.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhenB4cmluZnh6eGp1Y3hjcHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODkwODYsImV4cCI6MjA5MDA2NTA4Nn0.D8vGfrEFgNW2b1FkFWgkHe3p8uOL20ESMBHxGRUWtNw";

const sb = {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  async select(table) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=criado_em.desc`, { headers: this.headers });
      if (!r.ok) throw new Error(r.statusText);
      return await r.json();
    } catch (e) { console.warn(`[Supabase] select ${table}:`, e); return null; }
  },
  async insert(table, row) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: this.headers, body: JSON.stringify(row) });
      if (!r.ok) throw new Error(r.statusText);
      return (await r.json())?.[0] || row;
    } catch (e) { console.warn(`[Supabase] insert ${table}:`, e); return null; }
  },
  async update(table, id, patch) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method: "PATCH", headers: this.headers, body: JSON.stringify({ ...patch, atualizado_em: new Date().toISOString() }) });
      if (!r.ok) throw new Error(r.statusText);
      return (await r.json())?.[0] || patch;
    } catch (e) { console.warn(`[Supabase] update ${table}:`, e); return null; }
  },
  async remove(table, id) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: this.headers });
      return r.ok;
    } catch (e) { console.warn(`[Supabase] delete ${table}:`, e); return false; }
  },
};

// ==================== CONTEXT & STATE ====================
const AppContext = createContext(null);

const ETAPAS = [
  { id: "prospecção", label: "Prospecção", color: "#6366f1", icon: "🎯" },
  { id: "previsões", label: "Previsões", color: "#8b5cf6", icon: "📊" },
  { id: "proposta", label: "Proposta", color: "#f59e0b", icon: "📋" },
  { id: "negociação", label: "Negociação", color: "#3b82f6", icon: "🤝" },
  { id: "ganho", label: "Ganho", color: "#10b981", icon: "🏆" },
  { id: "perda", label: "Perda", color: "#ef4444", icon: "❌" },
];

const PERFIS = {
  gestor: { label: "Gestor", color: "#6366f1" },
  comercial: { label: "Comercial", color: "#3b82f6" },
  cs: { label: "CS", color: "#10b981" },
  tecnico: { label: "Técnico", color: "#f59e0b" },
  admin: { label: "Admin", color: "#ef4444" },
};

const PRIORIDADES = {
  baixa: { label: "Baixa", color: "#6b7280" },
  media: { label: "Média", color: "#3b82f6" },
  alta: { label: "Alta", color: "#f59e0b" },
  urgente: { label: "Urgente", color: "#ef4444" },
};

const TIPOS_PRODUTO = [
  { value: "fibra", label: "Fibra", color: "#6366f1" },
  { value: "radio", label: "Rádio", color: "#f59e0b" },
  { value: "fibra_radio", label: "Fibra+Rádio", color: "#8b5cf6" },
  { value: "backup", label: "Backup", color: "#06b6d4" },
  { value: "firewall", label: "Firewall", color: "#ef4444" },
  { value: "cloud", label: "Cloud", color: "#3b82f6" },
  { value: "storage", label: "Storage", color: "#10b981" },
  { value: "telefonia_ip", label: "Telefonia IP", color: "#ec4899" },
];

const MOTIVOS_VIABILIDADE = [
  { value: "upsell", label: "Upsell", color: "#10b981" },
  { value: "crossell", label: "Crossell", color: "#6366f1" },
  { value: "mudanca_endereco", label: "Mudança de Endereço", color: "#f59e0b" },
  { value: "novo_cliente", label: "Novo Cliente", color: "#3b82f6" },
  { value: "retencao", label: "Retenção", color: "#ef4444" },
];

const getProductLabel = (val) => TIPOS_PRODUTO.find(t => t.value === val)?.label || val;
const getProductColor = (val) => TIPOS_PRODUTO.find(t => t.value === val)?.color || "#6b7280";

const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

// ==================== SEED DATA ====================
const SEED_USERS = [
  const SEED_USERS = [
  { id: "a1b2c3d4-0001-4000-8000-000000000001", nome: "Carlos Almeida", email: "carlos@alhambra.com", perfil: "gestor", ativo: true },
  { id: "a1b2c3d4-0001-4000-8000-000000000002", nome: "Ana Silva", email: "ana@alhambra.com", perfil: "comercial", ativo: true },
  { id: "a1b2c3d4-0001-4000-8000-000000000003", nome: "Bruno Costa", email: "bruno@alhambra.com", perfil: "comercial", ativo: true },
  { id: "a1b2c3d4-0001-4000-8000-000000000004", nome: "Lucia Martins", email: "lucia@alhambra.com", perfil: "cs", ativo: true },
  { id: "a1b2c3d4-0001-4000-8000-000000000005", nome: "Pedro Souza", email: "pedro@alhambra.com", perfil: "tecnico", ativo: true },
];

const SEED_CLIENTES = [
  { id: "c1", nome: "TechCorp Ltda", email: "contato@techcorp.com", telefone: "(41) 3333-1111", endereco: "Rua XV de Novembro, 100", cidade: "Curitiba", estado: "PR", cep: "80020-310", operadora_atual: "Vivo", notas: "Cliente potencial grande", responsavel_tecnico_email: "infra@techcorp.com", responsavel_tecnico_telefone: "(41) 99999-1010", responsavel_financeiro_email: "financeiro@techcorp.com", responsavel_financeiro_telefone: "(41) 99999-1020", responsavel_comercial_email: "marcos@techcorp.com", responsavel_comercial_telefone: "(41) 99999-1030" },
  { id: "c2", nome: "Indústria Paraná S.A.", email: "ti@indparana.com", telefone: "(41) 3333-2222", endereco: "Av. Comendador Franco, 500", cidade: "Curitiba", estado: "PR", cep: "80215-090", operadora_atual: "Claro", notas: "", responsavel_tecnico_email: "ti@indparana.com", responsavel_tecnico_telefone: "(41) 99999-2010", responsavel_financeiro_email: "fin@indparana.com", responsavel_financeiro_telefone: "(41) 99999-2020", responsavel_comercial_email: "roberto@indparana.com", responsavel_comercial_telefone: "(41) 99999-2030" },
  { id: "c3", nome: "Hospital Santa Cruz", email: "infra@hsc.com", telefone: "(41) 3333-3333", endereco: "Rua Padre Anchieta, 200", cidade: "Curitiba", estado: "PR", cep: "80410-030", operadora_atual: "Oi", notas: "Necessita alta disponibilidade", responsavel_tecnico_email: "infra@hsc.com", responsavel_tecnico_telefone: "(41) 99999-3010", responsavel_financeiro_email: "contabil@hsc.com", responsavel_financeiro_telefone: "(41) 99999-3020", responsavel_comercial_email: "fernanda@hsc.com", responsavel_comercial_telefone: "(41) 99999-3030" },
  { id: "c4", nome: "Escola Nova Era", email: "direcao@novaera.edu", telefone: "(41) 3333-4444", endereco: "Rua Marechal Deodoro, 50", cidade: "Curitiba", estado: "PR", cep: "80010-010", operadora_atual: "Tim", notas: "", responsavel_tecnico_email: "", responsavel_tecnico_telefone: "", responsavel_financeiro_email: "admin@novaera.edu", responsavel_financeiro_telefone: "(41) 99999-4020", responsavel_comercial_email: "direcao@novaera.edu", responsavel_comercial_telefone: "(41) 99999-4030" },
  { id: "c5", nome: "Construtora Horizonte", email: "proj@horizonte.eng", telefone: "(41) 3333-5555", endereco: "Av. Sete de Setembro, 3000", cidade: "Curitiba", estado: "PR", cep: "80250-210", operadora_atual: "Vivo", notas: "Múltiplos canteiros de obra", responsavel_tecnico_email: "obras@horizonte.eng", responsavel_tecnico_telefone: "(41) 99999-5010", responsavel_financeiro_email: "fin@horizonte.eng", responsavel_financeiro_telefone: "(41) 99999-5020", responsavel_comercial_email: "proj@horizonte.eng", responsavel_comercial_telefone: "(41) 99999-5030" },
  { id: "c6", nome: "Supermercado Bom Preço", email: "gerencia@bompreco.com", telefone: "(41) 3333-6666", endereco: "Rua João Gualberto, 80", cidade: "Curitiba", estado: "PR", cep: "80030-000", operadora_atual: "Claro", notas: "3 filiais", responsavel_tecnico_email: "", responsavel_tecnico_telefone: "", responsavel_financeiro_email: "contabil@bompreco.com", responsavel_financeiro_telefone: "(41) 99999-6020", responsavel_comercial_email: "gerencia@bompreco.com", responsavel_comercial_telefone: "(41) 99999-6030" },
];

const SEED_OPORTUNIDADES = [
  { id: "o1", cliente_id: "c1", empresa: "TechCorp Ltda", solicitante: "Marcos Lima", email: "marcos@techcorp.com", endereco: "Rua XV, 100", coordenadas: "-25.4284,-49.2733", velocidade: "500 Mbps", produto: "fibra", valor_mensal: 2500, tempo_contrato: 24, etapa: "negociação", observacoes: "Precisa de link dedicado", responsavel_id: "u2" },
  { id: "o2", cliente_id: "c2", empresa: "Indústria Paraná S.A.", solicitante: "Roberto Neves", email: "roberto@indparana.com", endereco: "Av. Com. Franco, 500", coordenadas: "-25.4500,-49.2600", velocidade: "1 Gbps", produto: "fibra", valor_mensal: 5000, tempo_contrato: 36, etapa: "proposta", observacoes: "", responsavel_id: "u2" },
  { id: "o3", cliente_id: "c3", empresa: "Hospital Santa Cruz", solicitante: "Dra. Fernanda", email: "fernanda@hsc.com", endereco: "Rua P. Anchieta, 200", coordenadas: "-25.4400,-49.2800", velocidade: "200 Mbps", produto: "fibra", valor_mensal: 1800, tempo_contrato: 24, etapa: "previsões", observacoes: "Urgente", responsavel_id: "u3" },
  { id: "o4", cliente_id: "c4", empresa: "Escola Nova Era", solicitante: "Prof. André", email: "andre@novaera.edu", endereco: "Rua M. Deodoro, 50", coordenadas: "-25.4300,-49.2700", velocidade: "100 Mbps", produto: "radio", valor_mensal: 800, tempo_contrato: 12, etapa: "prospecção", observacoes: "Sem cobertura fibra", responsavel_id: "u3" },
  { id: "o5", cliente_id: "c5", empresa: "Construtora Horizonte", solicitante: "Eng. Paulo", email: "paulo@horizonte.eng", endereco: "Av. 7 Set, 3000", coordenadas: "-25.4350,-49.2650", velocidade: "300 Mbps", produto: "fibra", valor_mensal: 2000, tempo_contrato: 12, etapa: "ganho", observacoes: "Contrato assinado", responsavel_id: "u2" },
  { id: "o6", cliente_id: "c6", empresa: "Supermercado Bom Preço", solicitante: "Sr. João", email: "joao@bompreco.com", endereco: "Rua J. Gualberto, 80", coordenadas: "-25.4250,-49.2750", velocidade: "50 Mbps", produto: "radio", valor_mensal: 500, tempo_contrato: 12, etapa: "perda", observacoes: "Optou pelo concorrente", responsavel_id: "u3" },
  { id: "o7", cliente_id: "c1", empresa: "TechCorp Ltda - Filial", solicitante: "Marcos Lima", email: "marcos@techcorp.com", endereco: "Rua das Flores, 200", coordenadas: "-25.4290,-49.2740", velocidade: "200 Mbps", produto: "fibra", valor_mensal: 1500, tempo_contrato: 24, etapa: "prospecção", observacoes: "Nova filial", responsavel_id: "u2" },
  { id: "o8", cliente_id: "c3", empresa: "Hospital Santa Cruz - Anexo", solicitante: "Dr. Ricardo", email: "ricardo@hsc.com", endereco: "Rua Chile, 50", coordenadas: "-25.4410,-49.2810", velocidade: "100 Mbps", produto: "radio", valor_mensal: 900, tempo_contrato: 12, etapa: "previsões", observacoes: "", responsavel_id: "u2" },
];

const SEED_CONTRATOS = [
  { id: "ct1", cliente_id: "c5", empresa: "Construtora Horizonte", cnpj: "12.345.678/0001-90", endereco_instalacao: "Av. 7 Set, 3000", produto: "fibra", valor_mensal: 2000, data_assinatura: "2025-01-15", data_ativacao: "2025-02-01", prazo_meses: 12, status: "ativo", protegido: true, renovacao_automatica: true, multa_rescisao: "30%", responsavel_tecnico_nome: "Pedro Souza", responsavel_tecnico_email: "pedro@alhambra.com", responsavel_tecnico_telefone: "(41) 99999-0001", responsavel_financeiro_nome: "Maria Santos", responsavel_financeiro_email: "maria@horizonte.eng", responsavel_financeiro_telefone: "(41) 99999-0002", responsavel_comercial_nome: "Ana Silva", responsavel_comercial_email: "ana@alhambra.com", responsavel_comercial_telefone: "(41) 99999-0003", responsavel_id: "u4" },
  { id: "ct2", cliente_id: "c1", empresa: "TechCorp Ltda", cnpj: "98.765.432/0001-10", endereco_instalacao: "Rua XV, 100", produto: "fibra", valor_mensal: 3500, data_assinatura: "2024-06-01", data_ativacao: "2024-07-01", prazo_meses: 24, status: "ativo", protegido: true, renovacao_automatica: false, multa_rescisao: "50%", responsavel_tecnico_nome: "Pedro Souza", responsavel_tecnico_email: "pedro@alhambra.com", responsavel_tecnico_telefone: "(41) 99999-0001", responsavel_financeiro_nome: "Marcos Lima", responsavel_financeiro_email: "marcos@techcorp.com", responsavel_financeiro_telefone: "(41) 99999-1111", responsavel_comercial_nome: "Ana Silva", responsavel_comercial_email: "ana@alhambra.com", responsavel_comercial_telefone: "(41) 99999-0003", responsavel_id: "u4" },
  { id: "ct3", cliente_id: "c2", empresa: "Indústria Paraná S.A.", cnpj: "11.222.333/0001-44", endereco_instalacao: "Av. Com. Franco, 500", produto: "fibra", valor_mensal: 4500, data_assinatura: "2025-03-01", data_ativacao: "2025-03-15", prazo_meses: 36, status: "ativo", protegido: true, renovacao_automatica: true, multa_rescisao: "50%", responsavel_tecnico_nome: "Pedro Souza", responsavel_tecnico_email: "pedro@alhambra.com", responsavel_tecnico_telefone: "(41) 99999-0001", responsavel_financeiro_nome: "Roberto Neves", responsavel_financeiro_email: "roberto@indparana.com", responsavel_financeiro_telefone: "(41) 99999-2222", responsavel_comercial_nome: "Bruno Costa", responsavel_comercial_email: "bruno@alhambra.com", responsavel_comercial_telefone: "(41) 99999-0004", responsavel_id: "u4" },
];

const SEED_PRODUTOS = [
  { id: "p1", nome: "Fibra 100 Mbps", descricao: "Link dedicado 100 Mbps simétrico", tipo: "fibra", preco_base: 800, ativo: true },
  { id: "p2", nome: "Fibra 200 Mbps", descricao: "Link dedicado 200 Mbps simétrico", tipo: "fibra", preco_base: 1500, ativo: true },
  { id: "p3", nome: "Fibra 500 Mbps", descricao: "Link dedicado 500 Mbps simétrico", tipo: "fibra", preco_base: 2500, ativo: true },
  { id: "p4", nome: "Fibra 1 Gbps", descricao: "Link dedicado 1 Gbps simétrico", tipo: "fibra", preco_base: 5000, ativo: true },
  { id: "p5", nome: "Rádio 50 Mbps", descricao: "Link rádio 50 Mbps", tipo: "radio", preco_base: 500, ativo: true },
  { id: "p6", nome: "Rádio 100 Mbps", descricao: "Link rádio 100 Mbps", tipo: "radio", preco_base: 900, ativo: true },
  { id: "p7", nome: "Fibra+Rádio 200 Mbps", descricao: "Link redundante fibra + rádio", tipo: "fibra_radio", preco_base: 2200, ativo: true },
  { id: "p8", nome: "Backup Diário 500 GB", descricao: "Backup em nuvem com retenção 30 dias", tipo: "backup", preco_base: 350, ativo: true },
  { id: "p9", nome: "Firewall UTM", descricao: "Firewall gerenciado com IDS/IPS", tipo: "firewall", preco_base: 600, ativo: true },
  { id: "p10", nome: "Cloud Server 4 vCPU", descricao: "Servidor virtual 4 vCPU, 8 GB RAM", tipo: "cloud", preco_base: 450, ativo: true },
  { id: "p11", nome: "Storage 1 TB", descricao: "Armazenamento corporativo 1 TB", tipo: "storage", preco_base: 280, ativo: true },
  { id: "p12", nome: "Telefonia IP 10 Ramais", descricao: "Central PABX IP com 10 ramais", tipo: "telefonia_ip", preco_base: 400, ativo: true },
];

const SEED_TAREFAS = [
  { id: "t1", oportunidade_id: "o1", cliente_id: "c1", titulo: "Ligar para TechCorp", descricao: "Confirmar reunião de proposta", tipo: "ligacao", status: "aberta", prioridade: "alta", data_vencimento: "2026-04-01", atribuido_a: "u2", criado_por: "u1" },
  { id: "t2", oportunidade_id: "o2", cliente_id: "c2", titulo: "Enviar proposta Ind. Paraná", descricao: "Proposta 1 Gbps", tipo: "proposta", status: "em_progresso", prioridade: "urgente", data_vencimento: "2026-03-31", atribuido_a: "u2", criado_por: "u1" },
  { id: "t3", oportunidade_id: "o3", cliente_id: "c3", titulo: "Reunião Hospital Santa Cruz", descricao: "Apresentar solução", tipo: "reuniao", status: "aberta", prioridade: "media", data_vencimento: "2026-04-05", atribuido_a: "u3", criado_por: "u1" },
  { id: "t4", oportunidade_id: null, cliente_id: "c5", titulo: "Verificar instalação Horizonte", descricao: "Confirmar ativação do link", tipo: "ligacao", status: "concluida", prioridade: "media", data_vencimento: "2026-03-28", atribuido_a: "u5", criado_por: "u4" },
];

const SEED_ATIVIDADES = [
  { id: "a1", oportunidade_id: "o1", cliente_id: "c1", tipo: "ligacao", data_atividade: "2026-03-25T10:00:00", duracao_minutos: 15, assunto: "Primeiro contato", notas: "Cliente interessado em 500 Mbps", criado_por: "u2" },
  { id: "a2", oportunidade_id: "o1", cliente_id: "c1", tipo: "reuniao", data_atividade: "2026-03-27T14:00:00", duracao_minutos: 60, participantes: "Marcos Lima, Ana Silva", assunto: "Apresentação técnica", notas: "Demonstrado benefícios do link dedicado", criado_por: "u2" },
  { id: "a3", oportunidade_id: "o2", cliente_id: "c2", tipo: "email", data_atividade: "2026-03-26T09:00:00", duracao_minutos: 0, assunto: "Proposta comercial", notas: "Enviada proposta 1 Gbps fibra", criado_por: "u2" },
  { id: "a4", oportunidade_id: "o5", cliente_id: "c5", tipo: "contrato", data_atividade: "2026-01-15T16:00:00", duracao_minutos: 0, assunto: "Contrato assinado", notas: "Contrato 12 meses fibra 300 Mbps", criado_por: "u2" },
];

const SEED_VIABILIDADES = [
  { id: "v1", cliente_id: "c4", endereco: "Rua M. Deodoro, 50", latitude: -25.43, longitude: -49.27, tipo_conexao: "radio", velocidade: "100 Mbps", prazo: "15 dias", operadora_atual: "Tim", equipamentos: "Radio Ubiquiti AF60", metragem: "1.2 km", status_analise: "aprovado", analisado_por: "u5", notas_analise: "Visada limpa, sem obstrução", custo_instalacao: 3500, aprovado_por: "u1", notas_aprovacao: "Custo dentro do orçamento", criado_por: "u3", motivo: "novo_cliente", rede: "off_net", imagem_url: "" },
  { id: "v2", cliente_id: "c3", endereco: "Rua Chile, 50", latitude: -25.441, longitude: -49.281, tipo_conexao: "radio", velocidade: "100 Mbps", prazo: "20 dias", operadora_atual: "Oi", equipamentos: "Radio Cambium", metragem: "2.5 km", status_analise: "pendente", analisado_por: null, notas_analise: "", custo_instalacao: null, aprovado_por: null, notas_aprovacao: "", criado_por: "u2", motivo: "upsell", rede: "on_net", imagem_url: "" },
];

// ==================== HELPER COMPONENTS ====================
const Badge = ({ children, color = "#6366f1", className = "" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    style={{ backgroundColor: color + "20", color }}>
    {children}
  </span>
);

const Button = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false, icon: Icon }) => {
  const base = "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    primary: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500 shadow-sm",
    secondary: "bg-white/10 hover:bg-white/20 text-current border border-white/20 focus:ring-white/30",
    ghost: "hover:bg-white/10 text-current focus:ring-white/20",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
  };
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "", className = "", required = false, ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-medium text-slate-400">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
    <input type={type} value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
      {...props} />
  </div>
);

const Select = ({ label, value, onChange, options, className = "", placeholder = "Selecione..." }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
    <select value={value || ""} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors">
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, value, onChange, placeholder = "", rows = 3, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
    <textarea value={value || ""} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors resize-none" />
  </div>
);

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 px-4 overflow-y-auto" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative ${sizes[size]} w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl`}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick}
    className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 ${onClick ? "cursor-pointer hover:bg-slate-800 hover:border-slate-600 transition-all" : ""} ${className}`}>
    {children}
  </div>
);

const KPICard = ({ title, value, icon: Icon, color = "#f59e0b", trend, subtitle }) => (
  <Card className="relative overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5" style={{ backgroundColor: color, transform: "translate(30%, -30%)" }} />
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 rounded-lg" style={{ backgroundColor: color + "20" }}>
        <Icon size={18} style={{ color }} />
      </div>
      {trend && <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-400" : "text-red-400"}`}>
        {trend > 0 ? "+" : ""}{trend}%
      </span>}
    </div>
    <p className="text-2xl font-bold text-white mt-2">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{title}</p>
    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
  </Card>
);

const EmptyState = ({ icon: Icon, title, description, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="p-4 bg-slate-800/50 rounded-2xl mb-4"><Icon size={32} className="text-slate-500" /></div>
    <h3 className="text-lg font-medium text-slate-300 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
    {action && <Button onClick={onAction} icon={Plus}>{action}</Button>}
  </div>
);

const Tab = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${active === t.id ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}>
        {t.label}
      </button>
    ))}
  </div>
);

// ==================== LOGIN PAGE ====================
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("carlos@alhambra.com");
  const [senha, setSenha] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbUsers, setDbUsers] = useState(null);

  useEffect(() => {
    sb.select("usuarios").then(res => {
      if (Array.isArray(res) && res.length > 0) setDbUsers(res);
    });
  }, []);

  const allUsers = dbUsers || SEED_USERS;

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = allUsers.find(u => u.email === email);
      if (user) { onLogin(user); }
      else { setError("Email não encontrado. Tente: carlos@alhambra.com"); }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
    }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Geometric pattern inspired by Alhambra */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="#f59e0b" strokeWidth="0.5"/>
            <circle cx="30" cy="30" r="8" fill="none" stroke="#f59e0b" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#geo)"/>
        </svg>
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
            <Globe size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ALHAMBRA</h1>
          <p className="text-slate-400 text-sm mt-1">CRM — Gestão de Internet Corporativa</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">{error}</div>}
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" className="mb-3" />
          <Input label="Senha" value={senha} onChange={setSenha} type="password" placeholder="••••••" className="mb-1" />
          <p className="text-xs text-slate-500 mb-4">{dbUsers ? "✓ Conectado ao Supabase" : "Modo demo (dados locais)"}</p>
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center mb-2">Acesso rápido:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {allUsers.map(u => (
                <button key={u.id} onClick={() => { setEmail(u.email); onLogin(u); }}
                  className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors border border-slate-700/50">
                  {u.nome.split(" ")[0]} ({u.perfil})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== SIDEBAR ====================
const Sidebar = ({ currentPage, setCurrentPage, collapsed, setCollapsed, user }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "pipeline", label: "Pipeline", icon: Target },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "contratos", label: "Contratos", icon: FileText },
    { id: "viabilidades", label: "Viabilidades", icon: MapPin },
    { id: "tarefas", label: "Tarefas", icon: CheckCircle },
    { id: "produtos", label: "Produtos", icon: Wifi },
    { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  ];
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800 z-40 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>
      <div className="flex items-center gap-2 p-4 border-b border-slate-800">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
          <Globe size={16} className="text-white" />
        </div>
        {!collapsed && <span className="font-bold text-white tracking-wide">ALHAMBRA</span>}
      </div>
      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
              currentPage === item.id
                ? "bg-amber-600/20 text-amber-400 border border-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}>
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};

// ==================== HEADER ====================
const Header = ({ user, onLogout, pageTitle }) => (
  <header className="h-14 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 flex items-center justify-between px-5 sticky top-0 z-30">
    <h1 className="text-base font-semibold text-white">{pageTitle}</h1>
    <div className="flex items-center gap-3">
      <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
        <Bell size={18} /><span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
        <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{user.nome[0]}</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-white leading-tight">{user.nome}</p>
          <p className="text-[10px] text-slate-500">{PERFIS[user.perfil]?.label}</p>
        </div>
        <button onClick={onLogout} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1">
          <LogOut size={14} />
        </button>
      </div>
    </div>
  </header>
);

// ==================== DASHBOARD ====================
const DashboardPage = ({ data }) => {
  const { oportunidades, contratos, clientes, tarefas } = data;
  const ativas = oportunidades.filter(o => !["ganho", "perda"].includes(o.etapa));
  const ganhas = oportunidades.filter(o => o.etapa === "ganho");
  const perdas = oportunidades.filter(o => o.etapa === "perda");
  const contAtivos = contratos.filter(c => c.status === "ativo");
  const mrr = contAtivos.reduce((s, c) => s + (c.valor_mensal || 0), 0);
  const receitaTotal = contAtivos.reduce((s, c) => s + (c.valor_mensal || 0) * (c.prazo_meses || 0), 0);
  const tarefasAbertas = tarefas.filter(t => t.status === "aberta" || t.status === "em_progresso");
  const taxaConversao = oportunidades.length > 0 ? ((ganhas.length / oportunidades.length) * 100).toFixed(1) : 0;

  const funnelData = ETAPAS.filter(e => e.id !== "perda").map(e => ({
    name: e.label, value: oportunidades.filter(o => o.etapa === e.id).length, fill: e.color
  }));

  const receitaPorMes = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { mes: d.toLocaleDateString("pt-BR", { month: "short" }), receita: mrr + Math.floor(Math.random() * 2000 - 500) };
  });

  const prodData = TIPOS_PRODUTO.map(t => ({
    name: t.label, value: oportunidades.filter(o => o.produto === t.value).length, color: t.color,
  })).filter(d => d.value > 0);

  const vendedorData = SEED_USERS.filter(u => u.perfil === "comercial").map(u => ({
    name: u.nome.split(" ")[0],
    ganhas: oportunidades.filter(o => o.responsavel_id === u.id && o.etapa === "ganho").length,
    receita: oportunidades.filter(o => o.responsavel_id === u.id && o.etapa === "ganho").reduce((s, o) => s + (o.valor_mensal || 0), 0),
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard title="Oportunidades Ativas" value={ativas.length} icon={Target} color="#6366f1" />
        <KPICard title="Total Clientes" value={clientes.length} icon={Users} color="#3b82f6" />
        <KPICard title="Contratos Ativos" value={contAtivos.length} icon={FileText} color="#10b981" />
        <KPICard title="MRR" value={`R$ ${mrr.toLocaleString("pt-BR")}`} icon={DollarSign} color="#f59e0b" />
        <KPICard title="Taxa Conversão" value={`${taxaConversao}%`} icon={TrendingUp} color="#8b5cf6" />
        <KPICard title="Tarefas Abertas" value={tarefasAbertas.length} icon={CheckCircle} color="#ef4444" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Funil de Vendas</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Receita Mensal (MRR)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={receitaPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} formatter={v => [`R$ ${v.toLocaleString("pt-BR")}`, "MRR"]} />
              <Line type="monotone" dataKey="receita" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Produtos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={prodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {prodData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-white mb-3">Performance Vendedores</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vendedorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
              <Bar dataKey="ganhas" fill="#10b981" radius={[4, 4, 0, 0]} name="Ganhas" />
              <Bar dataKey="receita" fill="#6366f1" radius={[4, 4, 0, 0]} name="Receita" />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

// ==================== PIPELINE KANBAN ====================
const PipelinePage = ({ data, setData }) => {
  const { oportunidades, clientes } = data;
  const [dragId, setDragId] = useState(null);
  const [selectedOp, setSelectedOp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editOp, setEditOp] = useState(null);
  const [filterResp, setFilterResp] = useState("");
  const [filterProd, setFilterProd] = useState("");
  const [showContractModal, setShowContractModal] = useState(null);

  const filtered = oportunidades.filter(o => {
    if (filterResp && o.responsavel_id !== filterResp) return false;
    if (filterProd && o.produto !== filterProd) return false;
    return true;
  });

  const handleDrop = (etapa, opId) => {
    const updated = oportunidades.map(o => o.id === opId ? { ...o, etapa } : o);
    setData(prev => ({ ...prev, oportunidades: updated }));
    if (etapa === "ganho") {
      const op = oportunidades.find(o => o.id === opId);
      if (op) setShowContractModal(op);
    }
  };

  const saveOp = (form) => {
    if (editOp) {
      setData(prev => ({
        ...prev,
        oportunidades: prev.oportunidades.map(o => o.id === editOp.id ? { ...o, ...form } : o)
      }));
    } else {
      setData(prev => ({
        ...prev,
        oportunidades: [...prev.oportunidades, { ...form, id: uid(), etapa: "prospecção" }]
      }));
    }
    setShowForm(false);
    setEditOp(null);
  };

  const createContractFromOp = (op) => {
    const newContract = {
      id: uid(), cliente_id: op.cliente_id, empresa: op.empresa, cnpj: "", endereco_instalacao: op.endereco,
      produto: op.produto, valor_mensal: op.valor_mensal, data_assinatura: new Date().toISOString().split("T")[0],
      data_ativacao: "", prazo_meses: op.tempo_contrato, status: "ativo", protegido: true,
      renovacao_automatica: false, multa_rescisao: "30%",
      responsavel_tecnico_nome: "", responsavel_tecnico_email: "", responsavel_tecnico_telefone: "",
      responsavel_financeiro_nome: "", responsavel_financeiro_email: "", responsavel_financeiro_telefone: "",
      responsavel_comercial_nome: "", responsavel_comercial_email: "", responsavel_comercial_telefone: "",
      responsavel_id: op.responsavel_id,
    };
    setData(prev => ({ ...prev, contratos: [...prev.contratos, newContract] }));
    setShowContractModal(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          <Select value={filterResp} onChange={setFilterResp}
            options={SEED_USERS.filter(u => u.perfil === "comercial").map(u => ({ value: u.id, label: u.nome }))}
            placeholder="Todos responsáveis" />
          <Select value={filterProd} onChange={setFilterProd}
            options={TIPOS_PRODUTO.map(t => ({ value: t.value, label: t.label }))}
            placeholder="Todos produtos" />
        </div>
        <Button onClick={() => { setEditOp(null); setShowForm(true); }} icon={Plus}>Nova Oportunidade</Button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
        {ETAPAS.map(etapa => {
          const cards = filtered.filter(o => o.etapa === etapa.id);
          const total = cards.reduce((s, c) => s + (c.valor_mensal || 0), 0);
          return (
            <div key={etapa.id} className="flex-shrink-0 w-64"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (dragId) handleDrop(etapa.id, dragId); setDragId(null); }}>
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{etapa.icon}</span>
                  <span className="text-xs font-semibold text-white">{etapa.label}</span>
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">{cards.length}</span>
                </div>
                <span className="text-[10px] text-slate-500">R$ {total.toLocaleString("pt-BR")}</span>
              </div>
              <div className="space-y-2 min-h-[200px] p-1.5 bg-slate-800/30 rounded-xl border border-slate-700/30">
                {cards.map(op => {
                  const resp = SEED_USERS.find(u => u.id === op.responsavel_id);
                  return (
                    <div key={op.id} draggable onDragStart={() => setDragId(op.id)} onDragEnd={() => setDragId(null)}
                      onClick={() => setSelectedOp(op)}
                      className="bg-slate-900 border border-slate-700/50 rounded-lg p-3 cursor-pointer hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group">
                      <div className="flex items-start justify-between mb-1.5">
                        <p className="text-xs font-semibold text-white leading-tight pr-2">{op.empresa}</p>
                        <Badge color={getProductColor(op.produto)}>
                          {getProductLabel(op.produto)}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2">{op.solicitante}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">R$ {(op.valor_mensal || 0).toLocaleString("pt-BR")}/mês</span>
                        {resp && (
                          <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center" title={resp.nome}>
                            <span className="text-[9px] text-slate-300">{resp.nome[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedOp} onClose={() => setSelectedOp(null)} title={selectedOp?.empresa || ""} size="lg">
        {selectedOp && <OpportunityDetail op={selectedOp} data={data} setData={setData}
          onEdit={() => { setEditOp(selectedOp); setShowForm(true); setSelectedOp(null); }}
          onClose={() => setSelectedOp(null)} />}
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditOp(null); }}
        title={editOp ? "Editar Oportunidade" : "Nova Oportunidade"} size="lg">
        <OpportunityForm initial={editOp} onSave={saveOp} onCancel={() => { setShowForm(false); setEditOp(null); }} />
      </Modal>

      {/* Contract Creation Modal */}
      <Modal isOpen={!!showContractModal} onClose={() => setShowContractModal(null)} title="Criar Contrato?" size="sm">
        {showContractModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">A oportunidade <strong className="text-white">{showContractModal.empresa}</strong> foi marcada como <Badge color="#10b981">Ganho</Badge>.</p>
            <p className="text-sm text-slate-400">Deseja criar um contrato automaticamente?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowContractModal(null)}>Não</Button>
              <Button variant="success" onClick={() => createContractFromOp(showContractModal)}>Criar Contrato</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const OpportunityDetail = ({ op, data, setData, onEdit, onClose }) => {
  const resp = SEED_USERS.find(u => u.id === op.responsavel_id);
  const atividades = data.atividades.filter(a => a.oportunidade_id === op.id);
  const [newAct, setNewAct] = useState({ tipo: "ligacao", assunto: "", notas: "", data_atividade: new Date().toISOString().slice(0, 16) });
  const [showActForm, setShowActForm] = useState(false);

  const addAtividade = () => {
    const a = { ...newAct, id: uid(), oportunidade_id: op.id, cliente_id: op.cliente_id, criado_por: "u1" };
    setData(prev => ({ ...prev, atividades: [...prev.atividades, a] }));
    setShowActForm(false);
    setNewAct({ tipo: "ligacao", assunto: "", notas: "", data_atividade: new Date().toISOString().slice(0, 16) });
  };

  const tipoIcons = { ligacao: Phone, reuniao: Users, email: Mail, proposta: FileText, contrato: FileText };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div><span className="text-[10px] text-slate-500 uppercase">Empresa</span><p className="text-sm text-white font-medium">{op.empresa}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Solicitante</span><p className="text-sm text-white">{op.solicitante || "—"}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Email</span><p className="text-sm text-white">{op.email || "—"}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Endereço</span><p className="text-sm text-white">{op.endereco || "—"}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Produto</span><Badge color={getProductColor(op.produto)}>{getProductLabel(op.produto)}</Badge></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Velocidade</span><p className="text-sm text-white">{op.velocidade || "—"}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Valor Mensal</span><p className="text-sm text-amber-400 font-bold">R$ {(op.valor_mensal || 0).toLocaleString("pt-BR")}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Tempo Contrato</span><p className="text-sm text-white">{op.tempo_contrato || 0} meses</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">MRR</span><p className="text-sm text-white">R$ {(op.valor_mensal || 0).toLocaleString("pt-BR")}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Valor Total</span><p className="text-sm text-white">R$ {((op.valor_mensal || 0) * (op.tempo_contrato || 0)).toLocaleString("pt-BR")}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Responsável</span><p className="text-sm text-white">{resp?.nome || "—"}</p></div>
        <div><span className="text-[10px] text-slate-500 uppercase">Etapa</span><Badge color={ETAPAS.find(e => e.id === op.etapa)?.color || "#6b7280"}>{ETAPAS.find(e => e.id === op.etapa)?.label}</Badge></div>
      </div>
      {op.observacoes && <div><span className="text-[10px] text-slate-500 uppercase">Observações</span><p className="text-sm text-slate-300 mt-1">{op.observacoes}</p></div>}
      <div className="flex gap-2">
        <Button onClick={onEdit} icon={Edit2} variant="secondary" size="sm">Editar</Button>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Timeline de Atividades</h4>
          <Button size="sm" icon={Plus} onClick={() => setShowActForm(!showActForm)}>Atividade</Button>
        </div>
        {showActForm && (
          <div className="bg-slate-800/50 rounded-lg p-3 mb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Select label="Tipo" value={newAct.tipo} onChange={v => setNewAct(p => ({ ...p, tipo: v }))}
                options={[{ value: "ligacao", label: "Ligação" }, { value: "reuniao", label: "Reunião" }, { value: "email", label: "Email" }, { value: "proposta", label: "Proposta" }]} />
              <Input label="Data" type="datetime-local" value={newAct.data_atividade} onChange={v => setNewAct(p => ({ ...p, data_atividade: v }))} />
            </div>
            <Input label="Assunto" value={newAct.assunto} onChange={v => setNewAct(p => ({ ...p, assunto: v }))} />
            <Textarea label="Notas" value={newAct.notas} onChange={v => setNewAct(p => ({ ...p, notas: v }))} rows={2} />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowActForm(false)}>Cancelar</Button>
              <Button size="sm" onClick={addAtividade}>Salvar</Button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {atividades.sort((a, b) => new Date(b.data_atividade) - new Date(a.data_atividade)).map(a => {
            const Ic = tipoIcons[a.tipo] || Activity;
            return (
              <div key={a.id} className="flex gap-3 p-2 rounded-lg hover:bg-slate-800/30">
                <div className="flex-shrink-0 w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center mt-0.5">
                  <Ic size={12} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white">{a.assunto || a.tipo}</p>
                  <p className="text-[10px] text-slate-500">{new Date(a.data_atividade).toLocaleString("pt-BR")}</p>
                  {a.notas && <p className="text-xs text-slate-400 mt-0.5">{a.notas}</p>}
                </div>
              </div>
            );
          })}
          {atividades.length === 0 && <p className="text-xs text-slate-500 text-center py-4">Nenhuma atividade registrada</p>}
        </div>
      </div>
    </div>
  );
};

const OpportunityForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    empresa: "", solicitante: "", email: "", endereco: "", coordenadas: "", velocidade: "",
    produto: "fibra", valor_mensal: "", tempo_contrato: "", observacoes: "", responsavel_id: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Empresa" value={form.empresa} onChange={v => set("empresa", v)} required />
        <Input label="Solicitante" value={form.solicitante} onChange={v => set("solicitante", v)} />
        <Input label="Email" value={form.email} onChange={v => set("email", v)} type="email" />
        <Input label="Endereço" value={form.endereco} onChange={v => set("endereco", v)} />
        <Input label="Coordenadas GPS" value={form.coordenadas} onChange={v => set("coordenadas", v)} />
        <Input label="Velocidade" value={form.velocidade} onChange={v => set("velocidade", v)} />
        <Select label="Produto" value={form.produto} onChange={v => set("produto", v)}
          options={TIPOS_PRODUTO.map(t => ({ value: t.value, label: t.label }))} />
        <Input label="Valor Mensal (R$)" value={form.valor_mensal} onChange={v => set("valor_mensal", parseFloat(v) || "")} type="number" />
        <Input label="Tempo Contrato (meses)" value={form.tempo_contrato} onChange={v => set("tempo_contrato", parseInt(v) || "")} type="number" />
        <Select label="Responsável" value={form.responsavel_id} onChange={v => set("responsavel_id", v)}
          options={SEED_USERS.filter(u => u.perfil === "comercial").map(u => ({ value: u.id, label: u.nome }))} />
      </div>
      <Textarea label="Observações" value={form.observacoes} onChange={v => set("observacoes", v)} />
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)}>Salvar</Button>
      </div>
    </div>
  );
};

// ==================== CLIENTES ====================
const ClientesPage = ({ data, setData }) => {
  const { clientes, oportunidades, contratos } = data;
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const save = (form) => {
    if (editItem) {
      setData(prev => ({ ...prev, clientes: prev.clientes.map(c => c.id === editItem.id ? { ...c, ...form } : c) }));
    } else {
      setData(prev => ({ ...prev, clientes: [...prev.clientes, { ...form, id: uid() }] }));
    }
    setShowForm(false); setEditItem(null);
  };

  const del = (id) => setData(prev => ({ ...prev, clientes: prev.clientes.filter(c => c.id !== id) }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar clientes..." className="pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64" />
        </div>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true); }}>Novo Cliente</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-700">
            {["Nome", "Email", "Telefone", "Cidade", "Operadora", ""].map(h => (
              <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-slate-400 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelected(c)}>
                <td className="py-2.5 px-3 text-white font-medium">{c.nome}</td>
                <td className="py-2.5 px-3 text-slate-400">{c.email || "—"}</td>
                <td className="py-2.5 px-3 text-slate-400">{c.telefone || "—"}</td>
                <td className="py-2.5 px-3 text-slate-400">{c.cidade || "—"}</td>
                <td className="py-2.5 px-3 text-slate-400">{c.operadora_atual || "—"}</td>
                <td className="py-2.5 px-3">
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setEditItem(c); setShowForm(true); }} className="p-1 hover:bg-slate-700 rounded"><Edit2 size={13} className="text-slate-400" /></button>
                    <button onClick={() => del(c.id)} className="p-1 hover:bg-red-500/10 rounded"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={Users} title="Nenhum cliente" description="Adicione seu primeiro cliente" action="Novo Cliente" onAction={() => setShowForm(true)} />}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }}
        title={editItem ? "Editar Cliente" : "Novo Cliente"} size="lg">
        <ClienteForm initial={editItem} onSave={save} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.nome || ""} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[["Email", selected.email], ["Telefone", selected.telefone], ["Endereço", selected.endereco],
                ["Cidade", `${selected.cidade || ""} ${selected.estado ? "- " + selected.estado : ""}`],
                ["CEP", selected.cep], ["Operadora Atual", selected.operadora_atual]
              ].map(([l, v]) => (
                <div key={l}><span className="text-[10px] text-slate-500 uppercase">{l}</span><p className="text-sm text-white">{v || "—"}</p></div>
              ))}
            </div>
            {selected.notas && <div><span className="text-[10px] text-slate-500 uppercase">Notas</span><p className="text-sm text-slate-300">{selected.notas}</p></div>}
            <div className="border-t border-slate-700 pt-3">
              <h4 className="text-xs font-semibold text-white mb-2">Responsáveis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[["Técnico", "responsavel_tecnico"], ["Financeiro", "responsavel_financeiro"], ["Comercial", "responsavel_comercial"]].map(([label, prefix]) => (
                  <div key={prefix} className="bg-slate-800/30 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Resp. {label}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                      <Mail size={10} className="text-slate-500 flex-shrink-0" />
                      <span>{selected[`${prefix}_email`] || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                      <Phone size={10} className="text-slate-500 flex-shrink-0" />
                      <span>{selected[`${prefix}_telefone`] || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <h4 className="text-xs font-semibold text-white mb-2">Oportunidades ({oportunidades.filter(o => o.cliente_id === selected.id).length})</h4>
              {oportunidades.filter(o => o.cliente_id === selected.id).map(o => (
                <div key={o.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg mb-1">
                  <span className="text-xs text-white">{o.empresa}</span>
                  <Badge color={ETAPAS.find(e => e.id === o.etapa)?.color}>{ETAPAS.find(e => e.id === o.etapa)?.label}</Badge>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 pt-3">
              <h4 className="text-xs font-semibold text-white mb-2">Contratos ({contratos.filter(ct => ct.cliente_id === selected.id).length})</h4>
              {contratos.filter(ct => ct.cliente_id === selected.id).map(ct => (
                <div key={ct.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg mb-1">
                  <span className="text-xs text-white">{ct.empresa}</span>
                  <span className="text-xs text-amber-400">R$ {(ct.valor_mensal || 0).toLocaleString("pt-BR")}/mês</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ClienteForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || { nome: "", email: "", telefone: "", endereco: "", cidade: "", estado: "", cep: "", operadora_atual: "", notas: "", responsavel_tecnico_email: "", responsavel_tecnico_telefone: "", responsavel_financeiro_email: "", responsavel_financeiro_telefone: "", responsavel_comercial_email: "", responsavel_comercial_telefone: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nome" value={form.nome} onChange={v => set("nome", v)} required />
        <Input label="Email" value={form.email} onChange={v => set("email", v)} type="email" />
        <Input label="Telefone" value={form.telefone} onChange={v => set("telefone", v)} />
        <Input label="Endereço" value={form.endereco} onChange={v => set("endereco", v)} />
        <Input label="Cidade" value={form.cidade} onChange={v => set("cidade", v)} />
        <Input label="Estado" value={form.estado} onChange={v => set("estado", v)} />
        <Input label="CEP" value={form.cep} onChange={v => set("cep", v)} />
        <Input label="Operadora Atual" value={form.operadora_atual} onChange={v => set("operadora_atual", v)} />
      </div>
      {[["Responsável Técnico", "responsavel_tecnico"], ["Responsável Financeiro", "responsavel_financeiro"], ["Responsável Comercial", "responsavel_comercial"]].map(([label, prefix]) => (
        <div key={prefix}>
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">{label}</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" value={form[`${prefix}_email`]} onChange={v => set(`${prefix}_email`, v)} type="email" />
            <Input label="Telefone" value={form[`${prefix}_telefone`]} onChange={v => set(`${prefix}_telefone`, v)} />
          </div>
        </div>
      ))}
      <Textarea label="Notas" value={form.notas} onChange={v => set("notas", v)} />
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)}>Salvar</Button>
      </div>
    </div>
  );
};

// ==================== CONTRATOS ====================
const ContratosPage = ({ data, setData }) => {
  const { contratos } = data;
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const getDataFim = (c) => {
    if (!c.data_ativacao || !c.prazo_meses) return null;
    const d = new Date(c.data_ativacao);
    d.setMonth(d.getMonth() + c.prazo_meses);
    return d;
  };

  const enriched = contratos.map(c => {
    const dataFim = getDataFim(c);
    const hoje = new Date();
    const diasRestantes = dataFim ? Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24)) : null;
    const status = diasRestantes !== null && diasRestantes <= 30 && diasRestantes > 0 ? "prestes_a_vencer" : c.status;
    return { ...c, dataFim, diasRestantes, statusCalc: status };
  });

  const filtered = enriched.filter(c => {
    if (search && !c.empresa.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && c.statusCalc !== filterStatus) return false;
    return true;
  });

  const save = (form) => {
    if (editItem) {
      setData(prev => ({ ...prev, contratos: prev.contratos.map(c => c.id === editItem.id ? { ...c, ...form } : c) }));
    } else {
      setData(prev => ({ ...prev, contratos: [...prev.contratos, { ...form, id: uid() }] }));
    }
    setShowForm(false); setEditItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar contratos..." className="pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-56" />
          </div>
          <Select value={filterStatus} onChange={setFilterStatus}
            options={[{ value: "ativo", label: "Ativo" }, { value: "prestes_a_vencer", label: "Prestes a vencer" }]}
            placeholder="Todos status" />
        </div>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true); }}>Novo Contrato</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-700">
            {["Empresa", "Produto", "Valor/mês", "Prazo", "Fim", "Proteção", "Multa", "Status", ""].map(h => (
              <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-slate-400 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(c => {
              const protecao = c.renovacao_automatica;
              return (
              <tr key={c.id} className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelected(c)}>
                <td className="py-2.5 px-3 text-white font-medium">{c.empresa}</td>
                <td className="py-2.5 px-3"><Badge color={getProductColor(c.produto)}>{getProductLabel(c.produto)}</Badge></td>
                <td className="py-2.5 px-3 text-amber-400 font-medium">R$ {(c.valor_mensal || 0).toLocaleString("pt-BR")}</td>
                <td className="py-2.5 px-3 text-slate-400">{c.prazo_meses} meses</td>
                <td className="py-2.5 px-3 text-slate-400">{c.dataFim ? c.dataFim.toLocaleDateString("pt-BR") : "—"}</td>
                <td className="py-2.5 px-3">
                  <Badge color={protecao ? "#10b981" : "#ef4444"}>
                    {protecao ? "Protegido" : "Desprotegido"}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 text-slate-300 font-medium">{c.multa_rescisao}</td>
                <td className="py-2.5 px-3">
                  <Badge color={c.statusCalc === "prestes_a_vencer" ? "#f59e0b" : "#10b981"}>
                    {c.statusCalc === "prestes_a_vencer" ? "Vencendo" : "Ativo"}
                  </Badge>
                </td>
                <td className="py-2.5 px-3" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setEditItem(c); setShowForm(true); }} className="p-1 hover:bg-slate-700 rounded"><Edit2 size={13} className="text-slate-400" /></button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState icon={FileText} title="Nenhum contrato" description="Crie um novo contrato" action="Novo Contrato" onAction={() => setShowForm(true)} />}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }}
        title={editItem ? "Editar Contrato" : "Novo Contrato"} size="lg">
        <ContratoForm initial={editItem} onSave={save} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Contrato — ${selected?.empresa || ""}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[["CNPJ", selected.cnpj], ["Endereço Instalação", selected.endereco_instalacao],
                ["Produto", getProductLabel(selected.produto)],
                ["Valor Mensal", `R$ ${(selected.valor_mensal || 0).toLocaleString("pt-BR")}`],
                ["Data Assinatura", selected.data_assinatura ? new Date(selected.data_assinatura + "T12:00:00").toLocaleDateString("pt-BR") : "—"],
                ["Data Ativação", selected.data_ativacao ? new Date(selected.data_ativacao + "T12:00:00").toLocaleDateString("pt-BR") : "—"],
                ["Prazo", `${selected.prazo_meses} meses`],
                ["Data Fim", selected.dataFim ? selected.dataFim.toLocaleDateString("pt-BR") : "—"],
                ["Multa Rescisão", selected.multa_rescisao],
              ].map(([l, v]) => <div key={l}><span className="text-[10px] text-slate-500 uppercase">{l}</span><p className="text-sm text-white">{v || "—"}</p></div>)}
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Proteção</span>
                <div className="mt-0.5"><Badge color={selected.renovacao_automatica ? "#10b981" : "#ef4444"}>{selected.renovacao_automatica ? "Protegido — Renovação Auto" : "Desprotegido"}</Badge></div>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <h4 className="text-xs font-semibold text-white mb-2">Responsáveis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[["Técnico", "responsavel_tecnico"], ["Financeiro", "responsavel_financeiro"], ["Comercial", "responsavel_comercial"]].map(([label, prefix]) => (
                  <div key={prefix} className="bg-slate-800/30 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">{label}</p>
                    <p className="text-xs text-white">{selected[`${prefix}_nome`] || "—"}</p>
                    <p className="text-[10px] text-slate-400">{selected[`${prefix}_email`] || ""}</p>
                    <p className="text-[10px] text-slate-400">{selected[`${prefix}_telefone`] || ""}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ContratoForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    empresa: "", cnpj: "", endereco_instalacao: "", produto: "fibra", valor_mensal: "",
    data_assinatura: "", data_ativacao: "", prazo_meses: "", status: "ativo", protegido: true,
    renovacao_automatica: false, multa_rescisao: "30%",
    responsavel_tecnico_nome: "", responsavel_tecnico_email: "", responsavel_tecnico_telefone: "",
    responsavel_financeiro_nome: "", responsavel_financeiro_email: "", responsavel_financeiro_telefone: "",
    responsavel_comercial_nome: "", responsavel_comercial_email: "", responsavel_comercial_telefone: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-slate-400 uppercase">Dados do Contrato</h4>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Empresa" value={form.empresa} onChange={v => set("empresa", v)} required />
        <Input label="CNPJ" value={form.cnpj} onChange={v => set("cnpj", v)} />
        <Input label="Endereço Instalação" value={form.endereco_instalacao} onChange={v => set("endereco_instalacao", v)} className="col-span-2" />
        <Select label="Produto" value={form.produto} onChange={v => set("produto", v)}
          options={TIPOS_PRODUTO.map(t => ({ value: t.value, label: t.label }))} />
        <Input label="Valor Mensal (R$)" value={form.valor_mensal} onChange={v => set("valor_mensal", parseFloat(v) || "")} type="number" />
        <Input label="Data Assinatura" value={form.data_assinatura} onChange={v => set("data_assinatura", v)} type="date" />
        <Input label="Data Ativação" value={form.data_ativacao} onChange={v => set("data_ativacao", v)} type="date" />
        <Input label="Prazo (meses)" value={form.prazo_meses} onChange={v => set("prazo_meses", parseInt(v) || "")} type="number" />
        <Select label="Multa Rescisão" value={form.multa_rescisao} onChange={v => set("multa_rescisao", v)}
          options={[{ value: "30%", label: "30%" }, { value: "50%", label: "50%" }]} />
      </div>
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.renovacao_automatica} onChange={e => set("renovacao_automatica", e.target.checked)}
            className="rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-amber-500" />
          <span className="text-xs text-slate-300">Renovação Automática</span>
        </label>
        <Badge color={form.renovacao_automatica ? "#10b981" : "#ef4444"}>
          {form.renovacao_automatica ? "Protegido" : "Desprotegido"}
        </Badge>
      </div>
      <p className="text-[10px] text-slate-500 -mt-2">Proteção: contratos com renovação automática são considerados protegidos.</p>
      {[["Responsável Técnico", "responsavel_tecnico"], ["Responsável Financeiro", "responsavel_financeiro"], ["Responsável Comercial", "responsavel_comercial"]].map(([label, prefix]) => (
        <div key={prefix}>
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">{label}</h4>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Nome" value={form[`${prefix}_nome`]} onChange={v => set(`${prefix}_nome`, v)} />
            <Input label="Email" value={form[`${prefix}_email`]} onChange={v => set(`${prefix}_email`, v)} type="email" />
            <Input label="Telefone" value={form[`${prefix}_telefone`]} onChange={v => set(`${prefix}_telefone`, v)} />
          </div>
        </div>
      ))}
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)}>Salvar</Button>
      </div>
    </div>
  );
};

// ==================== VIABILIDADES ====================
const ViabilidadesPage = ({ data, setData }) => {
  const { viabilidades } = data;
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selected, setSelected] = useState(null);

  const save = (form) => {
    if (editItem) {
      setData(prev => ({ ...prev, viabilidades: prev.viabilidades.map(v => v.id === editItem.id ? { ...v, ...form } : v) }));
    } else {
      setData(prev => ({ ...prev, viabilidades: [...prev.viabilidades, { ...form, id: uid(), status_analise: "pendente" }] }));
    }
    setShowForm(false); setEditItem(null);
  };

  const approve = (id, field, userId) => {
    setData(prev => ({
      ...prev,
      viabilidades: prev.viabilidades.map(v => {
        if (v.id !== id) return v;
        if (field === "analise") return { ...v, status_analise: "aprovado", analisado_por: userId, analisado_em: new Date().toISOString() };
        if (field === "custo") return { ...v, aprovado_por: userId, aprovado_em: new Date().toISOString() };
        return v;
      })
    }));
  };

  const reject = (id) => {
    setData(prev => ({
      ...prev,
      viabilidades: prev.viabilidades.map(v => v.id === id ? { ...v, status_analise: "rejeitado" } : v)
    }));
  };

  const statusColors = { pendente: "#f59e0b", aprovado: "#10b981", rejeitado: "#ef4444" };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">{viabilidades.length} análise(s)</p>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true); }}>Nova Viabilidade</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {viabilidades.map(v => {
          const cliente = data.clientes.find(c => c.id === v.cliente_id);
          const motivoObj = MOTIVOS_VIABILIDADE.find(m => m.value === v.motivo);
          return (
            <Card key={v.id} onClick={() => setSelected(v)} className="hover:border-amber-500/30">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{v.endereco}</p>
                  <p className="text-[10px] text-slate-500">{cliente?.nome || "—"}</p>
                </div>
                <Badge color={statusColors[v.status_analise]}>{v.status_analise}</Badge>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-2">
                <Badge color={getProductColor(v.tipo_conexao)}>{getProductLabel(v.tipo_conexao)}</Badge>
                {v.rede && <Badge color={v.rede === "on_net" ? "#10b981" : "#8b5cf6"}>{v.rede === "on_net" ? "ON-NET" : "OFF-NET"}</Badge>}
                {motivoObj && <Badge color={motivoObj.color}>{motivoObj.label}</Badge>}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                {v.velocidade && <span>{v.velocidade}</span>}
                {v.metragem && <><span>•</span><span>{v.metragem}</span></>}
              </div>
              {v.custo_instalacao && <p className="text-xs text-amber-400 mt-1">Custo: R$ {v.custo_instalacao.toLocaleString("pt-BR")}</p>}
              {v.imagem_url && <div className="mt-2 h-16 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center"><img src={v.imagem_url} alt="Ozimap" className="h-full w-full object-cover" /></div>}
            </Card>
          );
        })}
        {viabilidades.length === 0 && <div className="col-span-3"><EmptyState icon={MapPin} title="Nenhuma viabilidade" description="Crie uma análise de viabilidade" action="Nova Viabilidade" onAction={() => setShowForm(true)} /></div>}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }}
        title={editItem ? "Editar Viabilidade" : "Nova Viabilidade"} size="lg">
        <ViabilidadeForm initial={editItem} data={data} onSave={save} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Análise de Viabilidade" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[["Endereço", selected.endereco], ["Tipo Conexão", getProductLabel(selected.tipo_conexao)],
                ["Velocidade", selected.velocidade], ["Prazo", selected.prazo],
                ["Operadora Atual", selected.operadora_atual], ["Metragem", selected.metragem],
                ["Equipamentos", selected.equipamentos], ["Custo Instalação", selected.custo_instalacao ? `R$ ${selected.custo_instalacao.toLocaleString("pt-BR")}` : "—"],
              ].map(([l, v]) => <div key={l}><span className="text-[10px] text-slate-500 uppercase">{l}</span><p className="text-sm text-white">{v || "—"}</p></div>)}
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Motivo</span>
                <div className="mt-0.5">{selected.motivo ? <Badge color={MOTIVOS_VIABILIDADE.find(m => m.value === selected.motivo)?.color || "#6b7280"}>{MOTIVOS_VIABILIDADE.find(m => m.value === selected.motivo)?.label || selected.motivo}</Badge> : <p className="text-sm text-white">—</p>}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Rede</span>
                <div className="mt-0.5">{selected.rede ? <Badge color={selected.rede === "on_net" ? "#10b981" : "#8b5cf6"}>{selected.rede === "on_net" ? "ON-NET" : "OFF-NET"}</Badge> : <p className="text-sm text-white">—</p>}</div>
              </div>
            </div>
            {selected.imagem_url && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Imagem Anexada</span>
                <div className="mt-1 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 max-h-64">
                  <img src={selected.imagem_url} alt="Imagem Viabilidade" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
            <div className="border-t border-slate-700 pt-3 space-y-3">
              <h4 className="text-xs font-semibold text-white">Aprovações</h4>
              <div className="flex gap-3">
                <div className="flex-1 bg-slate-800/30 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Análise Técnica</p>
                  <Badge color={statusColors[selected.status_analise]}>{selected.status_analise}</Badge>
                  {selected.status_analise === "pendente" && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="success" onClick={() => { approve(selected.id, "analise", "u5"); setSelected({ ...selected, status_analise: "aprovado" }); }}>Aprovar</Button>
                      <Button size="sm" variant="danger" onClick={() => { reject(selected.id); setSelected({ ...selected, status_analise: "rejeitado" }); }}>Rejeitar</Button>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-slate-800/30 rounded-lg p-3">
                  <p className="text-[10px] text-slate-500 uppercase mb-1">Aprovação de Custo</p>
                  {selected.aprovado_por ? <Badge color="#10b981">Aprovado</Badge> : <Badge color="#6b7280">Pendente</Badge>}
                  {!selected.aprovado_por && selected.status_analise === "aprovado" && (
                    <div className="mt-2">
                      <Button size="sm" variant="success" onClick={() => { approve(selected.id, "custo", "u1"); setSelected({ ...selected, aprovado_por: "u1" }); }}>Aprovar Custo</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ViabilidadeForm = ({ initial, data, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    cliente_id: "", endereco: "", latitude: "", longitude: "", tipo_conexao: "fibra",
    velocidade: "", prazo: "", operadora_atual: "", equipamentos: "", metragem: "", custo_instalacao: "",
    motivo: "", rede: "", imagem_url: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => set("imagem_url", reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select label="Cliente" value={form.cliente_id} onChange={v => set("cliente_id", v)}
          options={data.clientes.map(c => ({ value: c.id, label: c.nome }))} />
        <Select label="Tipo Conexão" value={form.tipo_conexao} onChange={v => set("tipo_conexao", v)}
          options={TIPOS_PRODUTO.map(t => ({ value: t.value, label: t.label }))} />
        <Select label="Motivo" value={form.motivo} onChange={v => set("motivo", v)}
          options={MOTIVOS_VIABILIDADE.map(m => ({ value: m.value, label: m.label }))} />
        <Select label="Rede" value={form.rede} onChange={v => set("rede", v)}
          options={[{ value: "on_net", label: "ON-NET" }, { value: "off_net", label: "OFF-NET" }]} />
        <Input label="Endereço" value={form.endereco} onChange={v => set("endereco", v)} required className="col-span-2" />
        <Input label="Latitude" value={form.latitude} onChange={v => set("latitude", v)} />
        <Input label="Longitude" value={form.longitude} onChange={v => set("longitude", v)} />
        <Input label="Velocidade" value={form.velocidade} onChange={v => set("velocidade", v)} />
        <Input label="Prazo" value={form.prazo} onChange={v => set("prazo", v)} />
        <Input label="Operadora Atual" value={form.operadora_atual} onChange={v => set("operadora_atual", v)} />
        <Input label="Metragem" value={form.metragem} onChange={v => set("metragem", v)} />
        <Input label="Equipamentos" value={form.equipamentos} onChange={v => set("equipamentos", v)} className="col-span-2" />
        <Input label="Custo Instalação (R$)" value={form.custo_instalacao} onChange={v => set("custo_instalacao", parseFloat(v) || "")} type="number" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-400">Imagem (Ozimap / Projeto)</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <Upload size={14} />
            {form.imagem_url ? "Trocar imagem" : "Anexar imagem"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {form.imagem_url && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-800 border border-slate-600">
                <img src={form.imagem_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button onClick={() => set("imagem_url", "")} className="text-[10px] text-red-400 hover:text-red-300">Remover</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)}>Salvar</Button>
      </div>
    </div>
  );
};

// ==================== TAREFAS ====================
const TarefasPage = ({ data, setData }) => {
  const { tarefas } = data;
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPrior, setFilterPrior] = useState("");

  const filtered = tarefas.filter(t => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPrior && t.prioridade !== filterPrior) return false;
    return true;
  });

  const save = (form) => {
    if (editItem) {
      setData(prev => ({ ...prev, tarefas: prev.tarefas.map(t => t.id === editItem.id ? { ...t, ...form } : t) }));
    } else {
      setData(prev => ({ ...prev, tarefas: [...prev.tarefas, { ...form, id: uid() }] }));
    }
    setShowForm(false); setEditItem(null);
  };

  const toggleStatus = (id) => {
    setData(prev => ({
      ...prev,
      tarefas: prev.tarefas.map(t => {
        if (t.id !== id) return t;
        const next = { aberta: "em_progresso", em_progresso: "concluida", concluida: "aberta", cancelada: "aberta" };
        return { ...t, status: next[t.status] };
      })
    }));
  };

  const statusLabels = { aberta: "Aberta", em_progresso: "Em Progresso", concluida: "Concluída", cancelada: "Cancelada" };
  const statusColors = { aberta: "#3b82f6", em_progresso: "#f59e0b", concluida: "#10b981", cancelada: "#6b7280" };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <Select value={filterStatus} onChange={setFilterStatus}
            options={Object.entries(statusLabels).map(([v, l]) => ({ value: v, label: l }))}
            placeholder="Todos status" />
          <Select value={filterPrior} onChange={setFilterPrior}
            options={Object.entries(PRIORIDADES).map(([v, p]) => ({ value: v, label: p.label }))}
            placeholder="Todas prioridades" />
        </div>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true); }}>Nova Tarefa</Button>
      </div>
      <div className="space-y-2">
        {filtered.map(t => {
          const atrib = SEED_USERS.find(u => u.id === t.atribuido_a);
          const venc = t.data_vencimento ? new Date(t.data_vencimento + (t.data_vencimento.includes("T") ? "" : "T12:00:00")) : null;
          const atrasada = venc && venc < new Date() && t.status !== "concluida";
          return (
            <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${atrasada ? "bg-red-500/5 border-red-500/20" : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"}`}>
              <button onClick={() => toggleStatus(t.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${t.status === "concluida" ? "bg-emerald-500 border-emerald-500" : "border-slate-600 hover:border-amber-500"}`}>
                {t.status === "concluida" && <CheckCircle size={12} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-medium ${t.status === "concluida" ? "text-slate-500 line-through" : "text-white"}`}>{t.titulo}</p>
                  <Badge color={PRIORIDADES[t.prioridade]?.color}>{PRIORIDADES[t.prioridade]?.label}</Badge>
                  <Badge color={statusColors[t.status]}>{statusLabels[t.status]}</Badge>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  {atrib && <span>{atrib.nome}</span>}
                  {venc && <span className={atrasada ? "text-red-400" : ""}>{venc.toLocaleDateString("pt-BR")}</span>}
                </div>
              </div>
              <button onClick={() => { setEditItem(t); setShowForm(true); }} className="p-1 hover:bg-slate-700 rounded">
                <Edit2 size={13} className="text-slate-400" />
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState icon={CheckCircle} title="Nenhuma tarefa" description="Crie sua primeira tarefa" action="Nova Tarefa" onAction={() => setShowForm(true)} />}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }}
        title={editItem ? "Editar Tarefa" : "Nova Tarefa"}>
        <TarefaForm initial={editItem} data={data} onSave={save} onCancel={() => { setShowForm(false); setEditItem(null); }} />
      </Modal>
    </div>
  );
};

const TarefaForm = ({ initial, data, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    titulo: "", descricao: "", tipo: "ligacao", status: "aberta", prioridade: "media",
    data_vencimento: "", atribuido_a: "", oportunidade_id: "", cliente_id: "",
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-3">
      <Input label="Título" value={form.titulo} onChange={v => set("titulo", v)} required />
      <Textarea label="Descrição" value={form.descricao} onChange={v => set("descricao", v)} rows={2} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={form.tipo} onChange={v => set("tipo", v)}
          options={[{ value: "ligacao", label: "Ligação" }, { value: "reuniao", label: "Reunião" }, { value: "email", label: "Email" }, { value: "proposta", label: "Proposta" }, { value: "contrato", label: "Contrato" }]} />
        <Select label="Status" value={form.status} onChange={v => set("status", v)}
          options={[{ value: "aberta", label: "Aberta" }, { value: "em_progresso", label: "Em Progresso" }, { value: "concluida", label: "Concluída" }, { value: "cancelada", label: "Cancelada" }]} />
        <Select label="Prioridade" value={form.prioridade} onChange={v => set("prioridade", v)}
          options={Object.entries(PRIORIDADES).map(([v, p]) => ({ value: v, label: p.label }))} />
        <Input label="Data Vencimento" value={form.data_vencimento?.split("T")[0] || form.data_vencimento} onChange={v => set("data_vencimento", v)} type="date" />
        <Select label="Atribuir a" value={form.atribuido_a} onChange={v => set("atribuido_a", v)}
          options={SEED_USERS.map(u => ({ value: u.id, label: u.nome }))} />
        <Select label="Cliente" value={form.cliente_id} onChange={v => set("cliente_id", v)}
          options={data.clientes.map(c => ({ value: c.id, label: c.nome }))} />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)}>Salvar</Button>
      </div>
    </div>
  );
};

// ==================== PRODUTOS ====================
const ProdutosPage = ({ data, setData }) => {
  const { produtos } = data;
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const save = (form) => {
    if (editItem) {
      setData(prev => ({ ...prev, produtos: prev.produtos.map(p => p.id === editItem.id ? { ...p, ...form } : p) }));
    } else {
      setData(prev => ({ ...prev, produtos: [...prev.produtos, { ...form, id: uid(), ativo: true }] }));
    }
    setShowForm(false); setEditItem(null);
  };

  const toggle = (id) => {
    setData(prev => ({ ...prev, produtos: prev.produtos.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p) }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">{produtos.length} produto(s)</p>
        <Button icon={Plus} onClick={() => { setEditItem(null); setShowForm(true); }}>Novo Produto</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {produtos.map(p => (
          <Card key={p.id} className={`${!p.ativo ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-white">{p.nome}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{p.descricao}</p>
              </div>
              <Badge color={getProductColor(p.tipo)}>
                {getProductLabel(p.tipo)}
              </Badge>
            </div>
            <p className="text-lg font-bold text-amber-400 mb-3">R$ {(p.preco_base || 0).toLocaleString("pt-BR")}<span className="text-xs font-normal text-slate-500">/mês</span></p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" icon={Edit2} onClick={() => { setEditItem(p); setShowForm(true); }}>Editar</Button>
              <Button size="sm" variant={p.ativo ? "ghost" : "success"} onClick={() => toggle(p.id)}>
                {p.ativo ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditItem(null); }}
        title={editItem ? "Editar Produto" : "Novo Produto"}>
        <div className="space-y-3">
          <ProdutoForm initial={editItem} onSave={save} onCancel={() => { setShowForm(false); setEditItem(null); }} />
        </div>
      </Modal>
    </div>
  );
};

const ProdutoForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || { nome: "", descricao: "", tipo: "fibra", preco_base: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-3">
      <Input label="Nome" value={form.nome} onChange={v => set("nome", v)} required />
      <Textarea label="Descrição" value={form.descricao} onChange={v => set("descricao", v)} rows={2} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={form.tipo} onChange={v => set("tipo", v)}
          options={TIPOS_PRODUTO.map(t => ({ value: t.value, label: t.label }))} />
        <Input label="Preço Base (R$)" value={form.preco_base} onChange={v => set("preco_base", parseFloat(v) || "")} type="number" />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)}>Salvar</Button>
      </div>
    </div>
  );
};

// ==================== RELATÓRIOS ====================
const RelatoriosPage = ({ data }) => {
  const [tab, setTab] = useState("vendas");
  const { oportunidades, contratos, viabilidades } = data;

  const vendasData = ETAPAS.map(e => ({
    etapa: e.label,
    qtd: oportunidades.filter(o => o.etapa === e.id).length,
    valor: oportunidades.filter(o => o.etapa === e.id).reduce((s, o) => s + (o.valor_mensal || 0), 0),
  }));

  const contratosResumo = {
    total: contratos.length,
    ativos: contratos.filter(c => c.status === "ativo").length,
    mrr: contratos.reduce((s, c) => s + (c.valor_mensal || 0), 0),
    arr: contratos.reduce((s, c) => s + (c.valor_mensal || 0), 0) * 12,
  };

  const contratosPorProduto = TIPOS_PRODUTO.map(t => ({
    name: t.label, value: contratos.filter(c => c.produto === t.value).length, color: t.color,
  })).filter(d => d.value > 0);

  const viabResumo = {
    total: viabilidades.length,
    aprovadas: viabilidades.filter(v => v.status_analise === "aprovado").length,
    rejeitadas: viabilidades.filter(v => v.status_analise === "rejeitado").length,
    pendentes: viabilidades.filter(v => v.status_analise === "pendente").length,
  };

  return (
    <div className="space-y-4">
      <Tab tabs={[
        { id: "vendas", label: "Vendas" },
        { id: "contratos", label: "Contratos" },
        { id: "receita", label: "Receita" },
        { id: "viabilidades", label: "Viabilidades" },
      ]} active={tab} onChange={setTab} />

      {tab === "vendas" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KPICard title="Total Oportunidades" value={oportunidades.length} icon={Target} color="#6366f1" />
            <KPICard title="Ganhas" value={oportunidades.filter(o => o.etapa === "ganho").length} icon={CheckCircle} color="#10b981" />
            <KPICard title="Perdas" value={oportunidades.filter(o => o.etapa === "perda").length} icon={X} color="#ef4444" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Vendas por Etapa</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vendasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="etapa" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                <Bar dataKey="qtd" fill="#6366f1" radius={[4, 4, 0, 0]} name="Quantidade" />
                <Bar dataKey="valor" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Valor Mensal (R$)" />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Detalhamento</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700">
                {["Etapa", "Qtd", "Valor Mensal Total", "% do Total"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-medium text-slate-400">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {vendasData.map(v => (
                  <tr key={v.etapa} className="border-b border-slate-800">
                    <td className="py-2 px-3 text-white">{v.etapa}</td>
                    <td className="py-2 px-3 text-slate-300">{v.qtd}</td>
                    <td className="py-2 px-3 text-amber-400">R$ {v.valor.toLocaleString("pt-BR")}</td>
                    <td className="py-2 px-3 text-slate-400">{oportunidades.length > 0 ? ((v.qtd / oportunidades.length) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === "contratos" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KPICard title="Total Contratos" value={contratosResumo.total} icon={FileText} color="#6366f1" />
            <KPICard title="Ativos" value={contratosResumo.ativos} icon={CheckCircle} color="#10b981" />
            {contratosPorProduto.slice(0, 4).map(cp => (
              <KPICard key={cp.name} title={cp.name} value={cp.value} icon={Wifi} color={cp.color} />
            ))}
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Contratos por Produto</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={contratosPorProduto}
                  cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                  {contratosPorProduto.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab === "receita" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <KPICard title="MRR (Mensal)" value={`R$ ${contratosResumo.mrr.toLocaleString("pt-BR")}`} icon={DollarSign} color="#10b981" />
            <KPICard title="ARR (Anual)" value={`R$ ${contratosResumo.arr.toLocaleString("pt-BR")}`} icon={TrendingUp} color="#6366f1" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Projeção de Receita (12 meses)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={Array.from({ length: 12 }, (_, i) => ({
                mes: new Date(2026, i).toLocaleDateString("pt-BR", { month: "short" }),
                receita: contratosResumo.mrr * (1 + i * 0.02),
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
                  formatter={v => [`R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`, "Receita"]} />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab === "viabilidades" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KPICard title="Total Análises" value={viabResumo.total} icon={MapPin} color="#6366f1" />
            <KPICard title="Aprovadas" value={viabResumo.aprovadas} icon={CheckCircle} color="#10b981" />
            <KPICard title="Rejeitadas" value={viabResumo.rejeitadas} icon={X} color="#ef4444" />
            <KPICard title="Pendentes" value={viabResumo.pendentes} icon={Clock} color="#f59e0b" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Status das Viabilidades</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[
                  { name: "Aprovadas", value: viabResumo.aprovadas },
                  { name: "Rejeitadas", value: viabResumo.rejeitadas },
                  { name: "Pendentes", value: viabResumo.pendentes },
                ]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                  <Cell fill="#10b981" /><Cell fill="#ef4444" /><Cell fill="#f59e0b" />
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN APP ====================
const pageTitles = {
  dashboard: "Dashboard",
  pipeline: "Pipeline de Vendas",
  clientes: "Clientes",
  contratos: "Contratos",
  viabilidades: "Viabilidade Técnica",
  tarefas: "Tarefas",
  produtos: "Produtos",
  relatorios: "Relatórios",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dbStatus, setDbStatus] = useState("loading"); // loading | online | offline
  const [syncing, setSyncing] = useState(false);

  const [data, setData] = useState({
    clientes: SEED_CLIENTES,
    oportunidades: SEED_OPORTUNIDADES,
    contratos: SEED_CONTRATOS,
    produtos: SEED_PRODUTOS,
    tarefas: SEED_TAREFAS,
    atividades: SEED_ATIVIDADES,
    viabilidades: SEED_VIABILIDADES,
  });

  // Load all data from Supabase on mount
  useEffect(() => {
    const tables = ["usuarios","clientes","oportunidades","contratos","produtos","tarefas","atividades","viabilidades"];
    let cancelled = false;

    async function loadAll() {
      setDbStatus("loading");
      try {
        const results = await Promise.all(tables.map(t => sb.select(t)));
        if (cancelled) return;

        // Check if any table loaded successfully (non-null & is array)
        const anyOk = results.some(r => Array.isArray(r));
        if (!anyOk) { setDbStatus("offline"); return; }

        const [usuarios, clientes, oportunidades, contratos, produtos, tarefas, atividades, viabilidades] = results;

        setData(prev => ({
          clientes: Array.isArray(clientes) && clientes.length > 0 ? clientes : prev.clientes,
          oportunidades: Array.isArray(oportunidades) && oportunidades.length > 0 ? oportunidades : prev.oportunidades,
          contratos: Array.isArray(contratos) && contratos.length > 0 ? contratos : prev.contratos,
          produtos: Array.isArray(produtos) && produtos.length > 0 ? produtos : prev.produtos,
          tarefas: Array.isArray(tarefas) && tarefas.length > 0 ? tarefas : prev.tarefas,
          atividades: Array.isArray(atividades) && atividades.length > 0 ? atividades : prev.atividades,
          viabilidades: Array.isArray(viabilidades) && viabilidades.length > 0 ? viabilidades : prev.viabilidades,
        }));
        setDbStatus("online");
      } catch (e) {
        console.warn("[Supabase] Load failed:", e);
        if (!cancelled) setDbStatus("offline");
      }
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  // Write-through wrapper: updates local state AND syncs to Supabase
  const setDataSync = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;

      // Detect what changed and sync to Supabase in background
      if (dbStatus === "online") {
        const tableNames = ["clientes","oportunidades","contratos","produtos","tarefas","atividades","viabilidades"];
        tableNames.forEach(table => {
          const oldArr = prev[table];
          const newArr = next[table];
          if (oldArr === newArr) return; // no change

          // Find new items (insert)
          const oldIds = new Set(oldArr.map(r => r.id));
          const newItems = newArr.filter(r => !oldIds.has(r.id));
          newItems.forEach(item => {
            const clean = { ...item };
            // Remove fields that don't exist in DB or are generated
            delete clean.dataFim;
            delete clean.diasRestantes;
            delete clean.statusCalc;
            sb.insert(table, clean).then(res => {
              if (res) setSyncing(s => { setTimeout(() => setSyncing(false), 800); return true; });
            });
          });

          // Find removed items (delete)
          const newIds = new Set(newArr.map(r => r.id));
          const removed = oldArr.filter(r => !newIds.has(r.id));
          removed.forEach(item => { sb.remove(table, item.id); });

          // Find updated items (patch)
          newArr.forEach(newItem => {
            const oldItem = oldArr.find(o => o.id === newItem.id);
            if (!oldItem) return; // new item, already handled
            if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
              const clean = { ...newItem };
              delete clean.dataFim;
              delete clean.diasRestantes;
              delete clean.statusCalc;
              sb.update(table, newItem.id, clean).then(res => {
                if (res) setSyncing(s => { setTimeout(() => setSyncing(false), 800); return true; });
              });
            }
          });
        });
      }

      return next;
    });
  }, [dbStatus]);

  if (!user) return <LoginPage onLogin={setUser} />;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage data={data} />;
      case "pipeline": return <PipelinePage data={data} setData={setDataSync} />;
      case "clientes": return <ClientesPage data={data} setData={setDataSync} />;
      case "contratos": return <ContratosPage data={data} setData={setDataSync} />;
      case "viabilidades": return <ViabilidadesPage data={data} setData={setDataSync} />;
      case "tarefas": return <TarefasPage data={data} setData={setDataSync} />;
      case "produtos": return <ProdutosPage data={data} setData={setDataSync} />;
      case "relatorios": return <RelatoriosPage data={data} />;
      default: return <DashboardPage data={data} />;
    }
  };

  const statusColors = { loading: "#f59e0b", online: "#10b981", offline: "#ef4444" };
  const statusLabels = { loading: "Conectando...", online: "Supabase Online", offline: "Offline (dados locais)" };
  const StatusIcon = dbStatus === "online" ? Cloud : dbStatus === "loading" ? Loader2 : CloudOff;

  return (
    <div className="min-h-screen text-slate-200">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-56"}`}>
        <Header user={user} onLogout={() => setUser(null)} pageTitle={pageTitles[currentPage] || ""} />
        {/* DB Status Bar */}
        <div className="mx-5 mt-3 flex items-center gap-2 text-[10px]">
          <StatusIcon size={12} style={{ color: statusColors[dbStatus], ...(dbStatus === "loading" ? { animation: "spin 1s linear infinite" } : {}) }} />
          <span style={{ color: statusColors[dbStatus] }}>{statusLabels[dbStatus]}</span>
          {syncing && <span className="text-amber-400 ml-2">● Salvando...</span>}
        </div>
        <main className="p-5 pt-2">{renderPage()}</main>
      </div>
    </div>
  );
}
