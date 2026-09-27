# FestaLab

Aplicação web moderna construída com Next.js 16 e React 19 que integra um editor visual interativo baseado em canvas (Konva) com inteligência artificial (OpenAI) para transformar mockups e elementos visuais de festas em imagens realistas.

## 🚀 Funcionalidades

- **Editor Visual (Builder):** Canvas interativo com suporte a manipulação de elementos, barra de ferramentas e painel de propriedades.
- **Geração por IA:** Integração com a API da OpenAI para renderização e conversão de mockups.
- **Persistência Local:** Armazenamento seguro de dados e estados utilizando IndexedDB.
- **Controle de Limites:** Sistema de rate limiting e controle de gerações (via Upstash Redis e hooks customizados).
- **Interface Responsiva:** Design otimizado para múltiplos dispositivos com navegação e ações rápidas móveis.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + React 19
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Canvas & Gráficos:** `konva` e `react-konva`
- **IA & APIs:** SDK oficial da OpenAI
- **Banco de Dados Local:** IndexedDB
- **Utilitários:** `lucide-react`, `class-variance-authority`, `@base-ui/react`

## 📋 Pré-requisitos

- **Node.js:** Versão 18 ou superior
- **Gerenciador de pacotes:** `npm`
- **Chave de API:** Conta na OpenAI com créditos disponíveis

## 📦 Instalação

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```

2. Configure o arquivo de ambiente na raiz do projeto (utilize o `.env.example` como referência):
   ```env
   OPENAI_API_KEY=sua-chave-aqui
   ```

## 🏃 Executando localmente

Inicie o servidor de desenvolvimento na porta `3001`:

```bash
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001) no seu navegador para acessar a aplicação.

## 🧪 Scripts Disponíveis

- `npm run dev` — Inicia o ambiente de desenvolvimento
- `npm run build` — Compila a aplicação para produção
- `npm run start` — Executa a aplicação compilada
- `npm run lint` — Executa a verificação de linting (ESLint)

## ☁️ Deploy na Vercel

O projeto está preparado para deploy simplificado na Vercel:

1. Envie o código para o seu repositório Git.
2. Importe o projeto no painel da Vercel.
3. Configure a variável de ambiente necessária:
   - `OPENAI_API_KEY`: sua chave de acesso da OpenAI
   - Variáveis adicionais de Redis/Upstash (se aplicável)
4. Conclua clicando em **Deploy**.
