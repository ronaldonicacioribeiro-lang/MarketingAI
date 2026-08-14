import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UsersService } from './users.service';

/**
 * Nesta sprint expõe apenas a consulta ao usuário autenticado
 * (tasks/001_autenticacao.md, Seção 11) — pré-requisito de
 * tasks/002_dashboard.md. Nenhuma outra operação de Usuários
 * (cadastro adicional, edição de perfil, desativação) é exposta aqui.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() currentUser: JwtPayload) {
    const user = await this.usersService.findByIdWithEmpresa(currentUser.sub);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      empresa: {
        id: String(user.empresaId._id),
        name: user.empresaId.name,
      },
    };
  }
}
