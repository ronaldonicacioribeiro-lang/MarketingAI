import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProjectHistory,
  ProjectHistoryDocument,
  ProjectHistoryEventType,
} from './schemas/project-history.schema';
import {
  Project,
  ProjectDocument,
  ProjectStatus,
} from './schemas/project.schema';

interface CreateProjectInput {
  name: string;
  objective: string;
}

interface UpdateProjectInput {
  name?: string;
  objective?: string;
  status?: ProjectStatus;
}

/**
 * ProjectsService — toda operação exige explicitamente `empresaId` e o
 * inclui na própria query Mongo, mesmo padrão de defesa em profundidade
 * já usado em ClientsService (tasks/003_clientes.md, Seção 8), conforme
 * tasks/004_projetos.md, Seção 11.
 *
 * A validação de que o Cliente existe e pertence à Empresa (Seção 10)
 * acontece no controller, antes de chamar `create` — mesmo padrão já
 * usado em ClientsController (`findScopedOrThrow`), não duplicado aqui.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectHistory.name)
    private readonly historyModel: Model<ProjectHistoryDocument>,
  ) {}

  async create(
    empresaId: Types.ObjectId,
    clientId: Types.ObjectId,
    data: CreateProjectInput,
  ): Promise<ProjectDocument> {
    const project = await this.projectModel.create({
      empresaId,
      clientId,
      name: data.name,
      objective: data.objective,
      status: ProjectStatus.PLANEJAMENTO,
    });

    await this.recordHistory(
      project._id,
      empresaId,
      ProjectHistoryEventType.CRIADO,
      null,
      ProjectStatus.PLANEJAMENTO,
    );

    return project;
  }

  /** Todos os projetos do Cliente, qualquer Estado — nada é ocultado por status. */
  async findAllByClient(
    clientId: Types.ObjectId,
    empresaId: Types.ObjectId,
  ): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ clientId, empresaId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /** `empresaId` faz parte do filtro — um projeto de outra Empresa nunca é retornado. */
  async findOneScoped(
    id: string,
    empresaId: Types.ObjectId,
  ): Promise<ProjectDocument | null> {
    return this.projectModel.findOne({ _id: id, empresaId }).exec();
  }

  /**
   * Atualiza nome/objetivo/estado. O controller já garante que o
   * projeto não está `concluido` antes de chamar este método (Seção 12).
   * Se `status` mudar, registra o evento no Histórico.
   */
  async update(
    id: string,
    empresaId: Types.ObjectId,
    data: UpdateProjectInput,
  ): Promise<ProjectDocument | null> {
    const current = await this.projectModel
      .findOne({ _id: id, empresaId })
      .exec();
    if (!current) {
      return null;
    }

    const updateFields: Partial<
      Pick<Project, 'name' | 'objective' | 'status'>
    > = {};
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.objective !== undefined) updateFields.objective = data.objective;
    if (data.status !== undefined) updateFields.status = data.status;

    const statusChanged =
      data.status !== undefined && data.status !== current.status;

    const updated = await this.projectModel
      .findOneAndUpdate(
        { _id: id, empresaId },
        { $set: updateFields },
        { returnDocument: 'after' },
      )
      .exec();

    if (updated && statusChanged) {
      await this.recordHistory(
        updated._id,
        empresaId,
        ProjectHistoryEventType.ESTADO_ALTERADO,
        current.status,
        updated.status,
      );
    }

    return updated;
  }

  /**
   * Encerra o projeto — muda `status` para `concluido` e registra o
   * evento. O controller já garante que o projeto ainda não está
   * `concluido` antes de chamar este método (Seção 12).
   */
  async close(
    id: string,
    empresaId: Types.ObjectId,
  ): Promise<ProjectDocument | null> {
    const current = await this.projectModel
      .findOne({ _id: id, empresaId })
      .exec();
    if (!current) {
      return null;
    }

    const updated = await this.projectModel
      .findOneAndUpdate(
        { _id: id, empresaId },
        { $set: { status: ProjectStatus.CONCLUIDO } },
        { returnDocument: 'after' },
      )
      .exec();

    if (updated) {
      await this.recordHistory(
        updated._id,
        empresaId,
        ProjectHistoryEventType.ESTADO_ALTERADO,
        current.status,
        ProjectStatus.CONCLUIDO,
      );
    }

    return updated;
  }

  /**
   * Ordem cronológica (mais antigo primeiro), conforme Seção 13 da task.
   * `projectId` é convertido explicitamente para `Types.ObjectId` antes
   * da query — diferente de `_id`, um campo ObjectId comum não recebe
   * cast automático de string pelo Mongoose nesta versão.
   */
  async findHistory(
    projectId: string,
    empresaId: Types.ObjectId,
  ): Promise<ProjectHistoryDocument[]> {
    return this.historyModel
      .find({ projectId: new Types.ObjectId(projectId), empresaId })
      .sort({ occurredAt: 1 })
      .exec();
  }

  private async recordHistory(
    projectId: Types.ObjectId,
    empresaId: Types.ObjectId,
    type: ProjectHistoryEventType,
    fromStatus: ProjectStatus | null,
    toStatus: ProjectStatus,
  ): Promise<void> {
    await this.historyModel.create({
      projectId,
      empresaId,
      type,
      fromStatus,
      toStatus,
    });
  }
}
