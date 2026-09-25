# FestaLab

MVP de transformação de mockups de festa em imagens realistas usando a API da OpenAI.

## Pré-requisitos
- Node.js (v18+)
- Conta na OpenAI com créditos

## Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` na raiz do projeto (use o `.env.example` como base):
   ```env
   OPENAI_API_KEY=sua-chave-aqui
   ```

## Executando localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Deploy na Vercel

O projeto está pronto para ser publicado na Vercel:

1. Faça push do código para um repositório Git.
2. Importe o projeto no painel da Vercel.
3. Adicione a variável de ambiente:
   - `OPENAI_API_KEY`: sua chave da OpenAI
4. Clique em Deploy.
