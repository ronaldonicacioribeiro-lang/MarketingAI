import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

type RequestWithUser = Request & { user?: JwtPayload };

/**
 * Expõe o usuário autenticado (payload do JWT) a controllers/services,
 * conforme tasks/001_autenticacao.md (Seção 8). Deve ser usado apenas em
 * rotas protegidas por JwtAuthGuard, que é quem popula `request.user`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user as JwtPayload;
  },
);
