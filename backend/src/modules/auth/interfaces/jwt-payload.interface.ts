/**
 * Conteúdo mínimo do JWT necessário para identificar o usuário autenticado,
 * conforme tasks/001_autenticacao.md (Seção 3: "token JWT contendo o mínimo
 * necessário para identificar o usuário").
 */
export interface JwtPayload {
  /** id do Usuário (subject) */
  sub: string;
  /** id da Empresa vinculada ao Usuário */
  empresaId: string;
}
