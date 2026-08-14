import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Template,
  TemplateDocument,
  TemplateStatus,
} from './schemas/template.schema';

interface CreateTemplateInput {
  name: string;
  description?: string;
  content?: string;
}

interface UpdateTemplateInput {
  name?: string;
  description?: string;
  content?: string;
}

/**
 * LibraryService — toda operação de leitura, escrita ou arquivamento
 * exige explicitamente `empresaId` e o inclui na própria query Mongo,
 * mesmo padrão de defesa em profundidade já usado em ClientsService
 * (tasks/003_clientes.md, Seção 8), conforme tasks/005_templates.md,
 * Seção 12. Cuida apenas de Template nesta sprint — quando Documento
 * for adicionado em sprint futura, ganha métodos próprios aqui, sem
 * reestruturar o módulo (tasks/005_templates.md, Seção 9).
 */
@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Template.name)
    private readonly templateModel: Model<TemplateDocument>,
  ) {}

  async create(
    empresaId: Types.ObjectId,
    data: CreateTemplateInput,
  ): Promise<TemplateDocument> {
    return this.templateModel.create({
      empresaId,
      name: data.name,
      description: data.description,
      content: data.content,
      status: TemplateStatus.ATIVO,
    });
  }

  /** Apenas templates ativos, escopados à Empresa — nunca todos os templates do banco. */
  async findAllActive(empresaId: Types.ObjectId): Promise<TemplateDocument[]> {
    return this.templateModel
      .find({ empresaId, status: TemplateStatus.ATIVO })
      .sort({ createdAt: -1 })
      .exec();
  }

  /** `empresaId` faz parte do filtro — um template de outra Empresa nunca é retornado. */
  async findOneScoped(
    id: string,
    empresaId: Types.ObjectId,
  ): Promise<TemplateDocument | null> {
    return this.templateModel.findOne({ _id: id, empresaId }).exec();
  }

  async update(
    id: string,
    empresaId: Types.ObjectId,
    data: UpdateTemplateInput,
  ): Promise<TemplateDocument | null> {
    return this.templateModel
      .findOneAndUpdate(
        { _id: id, empresaId },
        { $set: data },
        { returnDocument: 'after' },
      )
      .exec();
  }

  /** Mudança de estado — nunca um DELETE físico (tasks/005_templates.md, Seção 13). */
  async archive(
    id: string,
    empresaId: Types.ObjectId,
  ): Promise<TemplateDocument | null> {
    return this.templateModel
      .findOneAndUpdate(
        { _id: id, empresaId },
        { $set: { status: TemplateStatus.ARQUIVADO, archivedAt: new Date() } },
        { returnDocument: 'after' },
      )
      .exec();
  }
}
