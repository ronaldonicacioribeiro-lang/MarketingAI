import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

type RequestWithUser = Request & { user?: JwtPayload };

/**
 * Guard de proteção de rotas — valida o JWT usando JwtService.verifyAsync,
 * sem Passport, conforme decisão registrada em tasks/001_autenticacao.md
 * (Seção 13).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Autenticação necessária.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return undefined;
    }
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
