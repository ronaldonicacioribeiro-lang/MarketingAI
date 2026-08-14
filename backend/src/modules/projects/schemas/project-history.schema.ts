import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProjectStatus } from './project.schema';

/**
 * Versão mínima do Histórico do Projeto — apenas dois tipos de evento
 * nesta sprint, conforme tasks/004_projetos.md, Seção 4/8: criação do
 * projeto e mudança de Estado. Nenhum outro tipo (aprovações, entregas)
 * é gerado enquanto os módulos que os produziriam não existirem.
 */
export enum ProjectHistoryEventType {
  CRIADO = 'criado',
  ESTADO_ALTERADO = 'estado_alterado',
}

export type ProjectHistoryDocument = HydratedDocument<ProjectHistory>;

/**
 * Histórico do Projeto — coleção própria, não embutida no Projeto,
 * conforme docs/09_TECH_STACK.md: "Log IA e Histórico do Projeto, por
 * natureza de append-only e alto volume, são bons candidatos a coleções
 * otimizadas para escrita sequencial". Somente leitura pela API — todo
 * evento é criado como efeito colateral de outra operação
 * (tasks/004_projetos.md, Seção 13), nunca diretamente.
 */
@Schema({ collection: 'project_history' })
export class ProjectHistory {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true, index: true })
  empresaId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: ProjectHistoryEventType })
  type: ProjectHistoryEventType;

  @Prop({ type: String, enum: ProjectStatus, default: null })
  fromStatus: ProjectStatus | null;

  @Prop({ type: String, required: true, enum: ProjectStatus })
  toStatus: ProjectStatus;

  @Prop({ type: Date, required: true, default: Date.now })
  occurredAt: Date;
}

export const ProjectHistorySchema =
  SchemaFactory.createForClass(ProjectHistory);
