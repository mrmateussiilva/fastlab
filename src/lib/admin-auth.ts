export function getExpectedAdminPassword(): string | undefined {
  let expected = process.env.ADMIN_PASSWORD?.trim();

  if (expected) {
    // Remove aspas acidentais se o usuário colocou no painel da Vercel (ex: "minhasenha" ou 'minhasenha')
    if (
      (expected.startsWith('"') && expected.endsWith('"')) ||
      (expected.startsWith("'") && expected.endsWith("'"))
    ) {
      expected = expected.slice(1, -1).trim();
    }
  }

  // Em desenvolvimento local, se não estiver definida, usa 'admin123' como fallback.
  if (!expected && process.env.NODE_ENV !== 'production') {
    expected = 'admin123';
  }

  return expected || undefined;
}

export function checkAdminAuth(req: Request): boolean {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  const expectedPassword = getExpectedAdminPassword();

  if (!expectedPassword) {
    console.error('[AdminAuth] ADMIN_PASSWORD não configurada nas variáveis de ambiente da Vercel.');
    return false;
  }

  if (!authHeader) return false;

  // Extrai o token após "Bearer " ou pega o valor direto com trim
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  return token === expectedPassword;
}
