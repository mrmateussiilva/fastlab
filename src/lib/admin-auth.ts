export function checkAdminAuth(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');
  
  // Em produção exige a variável ADMIN_PASSWORD. Em desenvolvimento local, se não estiver definida, usa 'admin123' como fallback.
  const expectedPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'admin123' : undefined);

  if (!expectedPassword) {
    console.error('[AdminAuth] ADMIN_PASSWORD não configurada nas variáveis de ambiente.');
    return false;
  }

  return authHeader === `Bearer ${expectedPassword}`;
}
