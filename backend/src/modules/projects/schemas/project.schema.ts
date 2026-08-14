import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Estado do Projeto — conforme docs/05_DATABASE.md, os cinco valores de
 * exemplo. `CONCLUIDO` é terminal, alcançável apenas pela ação de
 * encerramento (tasks/004_projetos.md, Seção 12) — nunca via atualização
 * genérica.
 */
export enum ProjectStatus {
  PLANEJAMENTO = 'planejamento',
  EM_EXECUCAO = 'em_execucao',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  PAUSADO = 'pausado',
  CONCLUIDO = 'concluido',
}

/** Transição livre entre estes quatro — nenhuma ordem obrigatória
 * (tasks/004_projetos.md, Seção 4/12: sem máquina de estados formal). */
export const NON_TERMINAL_PROJECT_STATUSES = [
  ProjectStatus.PLANEJAMENTO,
  ProjectStatus.EM_EXECUCAO,
  ProjectStatus.AGUARDANDO_APROVACAO,
  ProjectStatus.PAUSADO,
];

export type ProjectDocument = HydratedDocument<Project>;

/**
 * Projeto — conforme docs/05_DATABASE.md: "Agrupar tudo o que é
 * produzido em nome de um Objetivo específico de um Cliente". Objetivo
 * e Estado vivem como campos do próprio Projeto (`objective`, `status`),
 * não como coleções — ver Nota de arquitetura em tasks/004_projetos.md,
 * Seção 8.
 */
@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true, index: true })
  empresaId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true, index: true })
  clientId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  objective: string;

  @Prop({
    type: String,
    required: true,
    enum: ProjectStatus,
    default: ProjectStatus.PLANEJAMENTO,
  })
  status: ProjectStatus;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
