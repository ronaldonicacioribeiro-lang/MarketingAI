import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/** Status do Cliente — arquivar é mudança de estado, nunca exclusão física
 * (tasks/003_clientes.md, Seção 12). */
export enum ClientStatus {
  ATIVO = 'ativo',
  ARQUIVADO = 'arquivado',
}

export type ClientDocument = HydratedDocument<Client>;

/**
 * Cliente — conforme docs/05_DATABASE.md: "Ser a fonte de contexto de
 * negócio usada pelo ClientAgent — quem é, o que já foi feito, o que
 * importa saber antes de agir." Pertence sempre a uma Empresa
 * (tasks/003_clientes.md, Seção 9) — nunca criado/consultado sem esse
 * escopo.
 */
@Schema({ timestamps: true, collection: 'clients' })
export class Client {
  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true, index: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  context?: string;

  @Prop({ required: true, enum: ClientStatus, default: ClientStatus.ATIVO })
  status: ClientStatus;

  @Prop({ type: Date, default: null })
  archivedAt: Date | null;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
