# 🏰 ALHAMBRA CRM

CRM completo para gestão de internet corporativa (Fibra, Rádio, Cloud, etc).

## ⚡ Deploy Rápido (3 minutos)

### Passo 1 — Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome: `crm-alhambra` (ou o que preferir)
3. Marque **Private**
4. Clique em **Create repository**

### Passo 2 — Subir o código

Descompacte o ZIP e no terminal:

```bash
cd crm-alhambra
git init
git add .
git commit -m "CRM Alhambra v1.0"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/crm-alhambra.git
git push -u origin main
```

### Passo 3 — Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New → Project**
3. Selecione o repositório `crm-alhambra`
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL` = `https://gazpxrinfxzxjucxcpwp.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = *(sua chave JWT)*
5. Clique em **Deploy**
6. Em ~1 minuto terá uma URL tipo `crm-alhambra.vercel.app`

### Passo 4 — Banco de Dados

Se ainda não fez: abra o **SQL Editor** do Supabase e execute o arquivo `supabase-schema.sql`.

---

## 🛠 Rodar Local

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`

---

## 📁 Estrutura

```
crm-alhambra/
├── public/favicon.svg
├── src/
│   ├── App.jsx          ← CRM completo (componentes + lógica)
│   ├── index.css         ← Tailwind + estilos globais
│   └── main.jsx          ← Entry point React
├── .env                  ← Credenciais Supabase (não vai pro Git)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon (JWT) do Supabase |

---

## 📦 Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Recharts** (gráficos)
- **Lucide React** (ícones)
- **Supabase** (PostgreSQL + API REST)
- **Vercel** (deploy)
