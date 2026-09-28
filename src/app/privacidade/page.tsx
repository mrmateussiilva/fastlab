import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade — FestaLab',
  description: 'Como o FestaLab coleta, usa e protege seus dados (LGPD).',
  robots: { index: false },
};

const LAST_UPDATED = '27 de setembro de 2026';

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] text-zinc-900">
      <header className="w-full border-b border-zinc-200/70 bg-[#FAFAF8]/90 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-950 select-none">
            FestaLab
          </span>
          <Link
            href="/"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-950 px-3 py-1.5 rounded-lg hover:bg-zinc-200/50 transition-colors font-sans"
          >
            ← Voltar ao início
          </Link>
        </div>
      </header>

      <article className="max-w-[820px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-zinc-950 leading-tight">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-xs text-zinc-400 font-sans">
          Última atualização: {LAST_UPDATED}
        </p>

        <div className="mt-8 space-y-8 text-sm sm:text-[15px] text-zinc-600 font-sans leading-relaxed">

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              1. Quem somos
            </h2>
            <p>
              O FestaLab é um aplicativo web que permite montar mockups de decoração de festas e
              gerar imagens realistas para apresentação a clientes. Esta política explica quais
              dados tratamos, com quais finalidades e como você pode exercer seus direitos previstos
              na Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              2. Quais dados coletamos
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-zinc-800">Dados de contato (voluntários):</strong> número de
                WhatsApp e, opcionalmente, e-mail — informados por você no card &quot;Quer aviso quando
                liberar novas gerações?&quot;, com consentimento expresso. Usamos apenas para avisar sobre
                disponibilidade de gerações, novidades e lançamento de planos do FestaLab.
              </li>
              <li>
                <strong className="text-zinc-800">Dados de uso do serviço:</strong> quando você gera
                uma imagem, o mockup montado (imagem) é enviado para a API da OpenAI para processamento
                da geração, com a finalidade exclusiva de produzir o resultado solicitado.
              </li>
              <li>
                <strong className="text-zinc-800">Endereço IP (transitório):</strong> utilizado apenas
                para controle de limite de gerações e prevenção de abuso, armazenado de forma temporária
                (expiração automática em até 1 hora) e não associado ao seu contato.
              </li>
              <li>
                <strong className="text-zinc-800">Dados locais no seu navegador:</strong> seus
                projetos, elementos e imagens enviadas ficam salvos localmente no seu dispositivo
                (armazenamento do navegador), sob seu controle. Não enviamos esses arquivos para
                nossos servidores, exceto a imagem do mockup no momento em que você solicita uma
                geração.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              3. Com quem compartilhamos
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-zinc-800">OpenAI</strong> — processamento das gerações de
                imagem (apenas o conteúdo necessário à requisição).
              </li>
              <li>
                <strong className="text-zinc-800">Upstash (Redis)</strong> — infraestrutura que
                armazena os contatos coletados e os contadores de limite.
              </li>
              <li>
                <strong className="text-zinc-800">Vercel</strong> — hospedagem do aplicativo.
              </li>
            </ul>
            <p className="mt-2">
              Não vendemos seus dados e não utilizamos ferramentas de publicidade ou rastreamento de
              terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              4. Por quanto tempo guardamos
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Contatos (WhatsApp/e-mail): até você pedir exclusão ou revogar o consentimento.</li>
              <li>Contadores de limite por IP: até 1 hora, com expiração automática.</li>
              <li>Projetos e imagens locais: até você limpar os dados do navegador.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              5. Seus direitos (LGPD, art. 18)
            </h2>
            <p>
              Você pode solicitar, a qualquer momento: confirmação da existência de tratamento,
              acesso aos seus dados, correção de dados incompletos ou incorretos, anonimização,
              portabilidade, eliminação dos dados tratados com base no consentimento e revogação
              do consentimento.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              6. Segurança
            </h2>
            <p>
              Utilizamos conexão criptografada (HTTPS), mantemos chaves de acesso protegidas no
              servidor e adotamos medidas técnicas razoáveis para proteger seus dados contra acesso
              não autorizado. Nenhum sistema é infalível; em caso de incidente relevante que possa
              afetar seus direitos, tomaremos as providências comunicáveis previstas em lei.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              7. Alterações desta política
            </h2>
            <p>
              Podemos atualizar esta política para refletir mudanças no serviço. A data de última
              atualização está sempre no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-900 mb-2">
              8. Contato
            </h2>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre privacidade, escreva para{' '}
              <a
                href="mailto:contato@festalab.com.br"
                className="text-orange-700 underline hover:text-orange-800"
              >
                contato@festalab.com.br
              </a>
              .
            </p>
          </section>

        </div>
      </article>
    </main>
  );
}
