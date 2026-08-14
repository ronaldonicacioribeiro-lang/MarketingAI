import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Empresa, EmpresaDocument } from './schemas/empresa.schema';
import { User, UserDocument, UserRole } from './schemas/user.schema';

interface CreateAdminInput {
  name: string;
  email: string;
  passwordHash: string;
  empresaId: Types.ObjectId;
}

/**
 * UsersService cuida exclusivamente de dados de Usuário/Empresa —
 * identidade e sessão são responsabilidade do AuthService, conforme
 * separação definida em docs/03_ARCHITECTURE.md (Seção 4) e reforçada
 * em tasks/001_autenticacao.md (Seção 8).
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Empresa.name)
    private readonly empresaModel: Model<EmpresaDocument>,
  ) {}

  /** Existe pelo menos um administrador cadastrado? Base do bloqueio do bootstrap. */
  async hasAdmin(): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ role: UserRole.ADMIN })
      .exec();
    return count > 0;
  }

  /**
   * Retorna a Empresa única já existente ou cria uma nova com o nome
   * informado — nunca mais de uma Empresa é criada (MVP single-tenant,
   * docs/03_ARCHITECTURE.md, Seção 9).
   */
  async findOrCreateEmpresa(name: string): Promise<EmpresaDocument> {
    const existing = await this.empresaModel.findOne().exec();
    if (existing) {
      return existing;
    }
    return this.empresaModel.create({ name });
  }

  async createAdmin(data: CreateAdminInput): Promise<UserDocument> {
    return this.userModel.create({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      role: UserRole.ADMIN,
      empresaId: data.empresaId,
    });
  }

  /** Usado exclusivamente pelo login — inclui passwordHash (select: false por padrão). */
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();
  }

  /** Usado por GET /users/me — nunca inclui passwordHash. */
  async findByIdWithEmpresa(id: string) {
    return this.userModel
      .findById(id)
      .populate<{ empresaId: EmpresaDocument }>('empresaId')
      .exec();
  }
}
