import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client, ClientDocument, ClientStatus } from './schemas/client.schema';

interface CreateClientInput {
  name: string;
  context?: string;
}

interface UpdateClientContextInput {
  name?: string;
  context?: string;
}

/**
 * ClientsService — toda operação de leitura, escrita ou arquivamento
 * exige explicitamente `empresaId` e o inclui na própria query Mongo
 * (nunca um filtro assumido/implícito), conforme tasks/003_clientes.md,
 * Seção 11/13: "toda operação (...) é filtrada pelo empresaId do
 * usuário autenticado, resolvido no backend".
 */
@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  async create(
    empresaId: Types.ObjectId,
    data: CreateClientInput,
  ): Promise<ClientDocument> {
    return this.clientModel.create({
      empresaId,
      name: data.name,
      context: data.context,
      status: ClientStatus.ATIVO,
    });
  }

  /** Apenas clientes ativos, escopados à Empresa — nunca todos os clientes do banco. */
  async findAllActive(empresaId: Types.ObjectId): Promise<ClientDocument[]> {
    return this.clientModel
      .find({ empresaId, status: ClientStatus.ATIVO })
      .sort({ createdAt: -1 })
      .exec();
  }

  /** `empresaId` faz parte do filtro — um cliente de outra Empresa nunca é retornado. */
  async findOneScoped(
    id: string,
    empresaId: Types.ObjectId,
  ): Promise<ClientDocument | null> {
    return this.clientModel.findOne({ _id: id, empresaId }).exec();
  }

  async updateContext(
    id: string,
    empresaId: Types.ObjectId,
    data: UpdateClientContextInput,
  ): Promise<ClientDocument | null> {
    return this.clientModel
      .findOneAndUpdate(
        { _id: id, empresaId },
        { $set: data },
        { returnDocument: 'after' },
      )
      .exec();
  }

  /** Mudança de estado — nunca um DELETE físico (tasks/003_clientes.md, Seção 12). */
  async archive(
    id: string,
    empresaId: Types.ObjectId,
  ): Promise<ClientDocument | null> {
    return this.clientModel
      .findOneAndUpdate(
        { _id: id, empresaId },
        { $set: { status: ClientStatus.ARQUIVADO, archivedAt: new Date() } },
        { returnDocument: 'after' },
      )
      .exec();
  }
}
