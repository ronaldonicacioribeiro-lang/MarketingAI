import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Empresa — entidade única do MVP (single-tenant), conforme docs/05_DATABASE.md
 * e docs/03_ARCHITECTURE.md (Seção 9).
 *
 * Vive no módulo Usuários, não em um módulo próprio — ver Nota de arquitetura
 * em tasks/001_autenticacao.md (Seção 9). Nenhum campo além do estritamente
 * necessário para o bootstrap do primeiro administrador é criado aqui.
 */
export type EmpresaDocument = HydratedDocument<Empresa>;

@Schema({ timestamps: true, collection: 'empresas' })
export class Empresa {
  @Prop({ required: true, trim: true })
  name: string;
}

export const EmpresaSchema = SchemaFactory.createForClass(Empresa);
