# FestaLab

Aplicação web moderna e de alta performance construída com **Next.js 16 (App Router)** e **React 19**, projetada para revolucionar o planejamento e a visualização de decorações e mockups de festas. O sistema combina um editor visual em tempo real baseado em canvas com inteligência artificial generativa, permitindo criar, customizar e converter projetos em imagens realistas.

---

## 🚀 Funcionalidades Principais

- **Editor Visual Interativo (Builder):**
  - Canvas dinâmico baseado em `Konva` e `React Konva` para manipulação fluida de elementos gráficos.
  - Barra de ferramentas intuitiva e painel de propriedades avançado para customização de objetos.
  - Ações rápidas otimizadas para dispositivos móveis (Mobile Quick Actions e Bottom Navigation).
- **Geração de Imagens por IA:**
  - Integração nativa com a API da OpenAI para traduzir o layout montado no canvas em imagens fotorrealistas e detalhadas de festas.
- **Persistência de Dados Robusta:**
  - Armazenamento client-side descentralizado utilizando **IndexedDB** para garantir que os projetos e estados do usuário não sejam perdidos.
- **Controle de Taxa e Limites (Rate Limiting):**
  - Sistema integrado com `@upstash/redis` e hooks customizados para gerenciar cotas e limites de geração de forma segura.

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 16 (App Router)
- **Biblioteca UI:** React 19
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Renderização Gráfica:** `konva`, `react-konva`
- **Inteligência Artificial:** SDK da OpenAI (`openai`)
- **Persistência:** IndexedDB (`idb`)
- **Rate Limiting:** Upstash Redis (`@upstash/redis`)
- **Ícones & Componentes:** `lucide-react`, `@base-ui/react`, *Shadcn UI*
- **Qualidade de Código:** TypeScript, ESLint

---

## 🔮 Roadmap & Próximas Features

- **Renderização 3D de Mockups via Inteligência Artificial Aumentada:**
  - Conversão automatizada de layouts 2D do canvas em modelos 3D interativos e imersivos.
  - Projeção de ambientes virtuais tridimensionais fotorrealistas utilizando modelos generativos avançados combinados com inteligência aumentada, permitindo visualizar a decoração sob múltiplos ângulos (360°), simular iluminação ambiente real e inspecionar a escala volumétrica dos elementos da festa.

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Node.js:** Versão 18.x ou superior
- **npm:** Gerenciador de pacotes padrão
- **Chave de API OpenAI:** Conta ativa na OpenAI com créditos válidos para consumo das APIs de imagem e chat.

---

## 📦 Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone [https://github.com/mrmateussiilva/fastlab.git](https://github.com/mrmateussiilva/fastlab.git)
   cd fastlab
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto baseando-se no `.env.example`:
   ```env
   OPENAI_API_KEY=sua-chave-openai-aqui
   ```

---

## 🏃 Executando Localmente

Inicie o servidor de desenvolvimento na porta padrão `3001`:

```bash
npm run dev
```

Abra o navegador em [http://localhost:3001](http://localhost:3001) para interagir com a aplicação.

---

## 🧪 Scripts Disponíveis

No `package.json` você encontrará os seguintes scripts:

- `npm run dev`: Inicia o ambiente de desenvolvimento Next.js na porta `3001`
- `npm run build`: Cria a versão otimizada de produção
- `npm run start`: Inicia o servidor em modo de produção na porta `3001`
- `npm run lint`: Executa a verificação estática de código com o ESLint

---

## ☁️ Deploy na Vercel

A aplicação está totalmente otimizada para deploy na plataforma Vercel:

1. Conecte o repositório Git ao seu painel da Vercel.
2. Configure as variáveis de ambiente necessárias:
   - `OPENAI_API_KEY`: Sua chave secreta da OpenAI
3. Clique em **Deploy**.

---

## 📄 Licença

Este projeto é distribuído sob a licença privada / uso interno.
