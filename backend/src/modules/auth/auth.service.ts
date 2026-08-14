import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { FirstAdminDto } from './dto/first-admin.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

const SALT_ROUNDS = 10;

/** Mesma mensagem para e-mail inexistente e senha incorreta — docs/06_API.md:
 * "Falhas de autenticação nunca revelam se uma conta existe ou não". */
const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha inválidos.';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createFirstAdmin(dto: FirstAdminDto) {
    const alreadyExists = await this.usersService.hasAdmin();
    if (alreadyExists) {
      throw new ConflictException(
        'Já existe um administrador cadastrado. Utilize a tela de login.',
      );
    }

    const empresa = await this.usersService.findOrCreateEmpresa(
      dto.empresaName,
    );
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.usersService.createAdmin({
      name: dto.name,
      email: dto.email,
      passwordHash,
      empresaId: empresa._id,
    });

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const payload: JwtPayload = {
      sub: String(user._id),
      empresaId: String(user.empresaId),
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
