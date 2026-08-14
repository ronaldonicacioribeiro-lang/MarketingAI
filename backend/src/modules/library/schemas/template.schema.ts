import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/** Status do Template — arquivar é mudança de estado, nunca exclusão
 * física (tasks/005_templates.md, Seção 13), mesmo padrão de Cliente. */
export enum TemplateStatus {
  ATIVO = 'ativo',
  ARQUIVADO = 'arquivado',
}

export type TemplateDocument = HydratedDocument<Template>;

/**
 * Template — conforme docs/05_DATABASE.md: "Representar um modelo
 * reutilizável usado como ponto de partida para novas Landing Pages
 * (...) Pertence à Biblioteca". Pertence sempre a uma Empresa (não a um
 * Cliente ou Projeto), conforme docs/06_API.md, domínio Biblioteca:
 * "Itens da Biblioteca pertencem à Empresa, não a um projeto
 * específico" — ver Nota de arquitetura em tasks/005_templates.md,
 * Seção 9.
 */
@Schema({ timestamps: true, collection: 'templates' })
export class Template {
  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true, index: true })
  empresaId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  content?: string;

  @Prop({ required: true, enum: TemplateStatus, default: TemplateStatus.ATIVO })
  status: TemplateStatus;

  @Prop({ type: Date, default: null })
  archivedAt: Date | null;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
