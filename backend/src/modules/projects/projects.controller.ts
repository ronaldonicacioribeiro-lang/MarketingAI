import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ClientsService } from '../clients/clients.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { ProjectHistoryDocument } from './schemas/project-history.schema';
import { ProjectDocument, ProjectStatus } from './schemas/project.schema';

const PROJECT_NOT_FOUND_MESSAGE = 'Projeto não encontrado.';
const CLIENT_NOT_FOUND_MESSAGE = 'Cliente não encontrado.';
const PROJECT_CLOSED_MESSAGE =
  'Projeto encerrado não pode ser alterado ou encerrado novamente.';

function toProjectResponse(project: ProjectDocument) {
  return {
    id: String(project._id),
    clientId: String(project.clientId),
    name: project.name,
    objective: project.objective,
    status: project.status,
  };
}

function toHistoryResponse(entry: ProjectHistoryDocument) {
  return {
    id: String(entry._id),
    type: entry.type,
    fromStatus: entry.fromStatus,
    toStatus: entry.toStatus,
    occurredAt: entry.occurredAt,
  };
}

/**
 * Todas as rotas exigem JWT válido e são sempre escopadas à Empresa do
 * usuário autenticado — mesmo padrão de ClientsController
 * (tasks/003_clientes.md), conforme tasks/004_projetos.md, Seção 9/11.
 * Nenhuma rota tem prefixo único de classe, pois mistura caminhos
 * aninhados sob Cliente (criação/listagem) e caminhos próprios de
 * Projeto (consulta/atualização/encerramento/timeline) — Seção 9.
 */
@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly clientsService: ClientsService,
  ) {}

  @Post('clients/:clientId/projects')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('clientId') clientId: string,
    @Body() dto: CreateProjectDto,
  ) {
    await this.findClientOrThrow(clientId, user.empresaId);
    const project = await this.projectsService.create(
      new Types.ObjectId(user.empresaId),
      new Types.ObjectId(clientId),
      dto,
    );
    return toProjectResponse(project);
  }

  @Get('clients/:clientId/projects')
  async findAllForClient(
    @CurrentUser() user: JwtPayload,
    @Param('clientId') clientId: string,
  ) {
    await this.findClientOrThrow(clientId, user.empresaId);
    const projects = await this.projectsService.findAllByClient(
      new Types.ObjectId(clientId),
      new Types.ObjectId(user.empresaId),
    );
    return projects.map(toProjectResponse);
  }

  @Get('projects/:id')
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const project = await this.findProjectOrThrow(id, user.empresaId);
    return toProjectResponse(project);
  }

  @Patch('projects/:id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const project = await this.findProjectOrThrow(id, user.empresaId);
    if (project.status === ProjectStatus.CONCLUIDO) {
      throw new ConflictException(PROJECT_CLOSED_MESSAGE);
    }
    const updated = await this.projectsService.update(
      id,
      new Types.ObjectId(user.empresaId),
      dto,
    );
    if (!updated) {
      throw new NotFoundException(PROJECT_NOT_FOUND_MESSAGE);
    }
    return toProjectResponse(updated);
  }

  @Get('projects/:id/history')
  async history(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.findProjectOrThrow(id, user.empresaId);
    const events = await this.projectsService.findHistory(
      id,
      new Types.ObjectId(user.empresaId),
    );
    return events.map(toHistoryResponse);
  }

  @Post('projects/:id/close')
  @HttpCode(HttpStatus.OK)
  async close(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const project = await this.findProjectOrThrow(id, user.empresaId);
    if (project.status === ProjectStatus.CONCLUIDO) {
      throw new ConflictException(PROJECT_CLOSED_MESSAGE);
    }
    const closed = await this.projectsService.close(
      id,
      new Types.ObjectId(user.empresaId),
    );
    if (!closed) {
      throw new NotFoundException(PROJECT_NOT_FOUND_MESSAGE);
    }
    return toProjectResponse(closed);
  }

  /** Valida o formato do id e a propriedade da Empresa antes de qualquer operação. */
  private async findClientOrThrow(clientId: string, empresaId: string) {
    if (!Types.ObjectId.isValid(clientId)) {
      throw new NotFoundException(CLIENT_NOT_FOUND_MESSAGE);
    }
    const client = await this.clientsService.findOneScoped(
      clientId,
      new Types.ObjectId(empresaId),
    );
    if (!client) {
      throw new NotFoundException(CLIENT_NOT_FOUND_MESSAGE);
    }
    return client;
  }

  private async findProjectOrThrow(id: string, empresaId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(PROJECT_NOT_FOUND_MESSAGE);
    }
    const project = await this.projectsService.findOneScoped(
      id,
      new Types.ObjectId(empresaId),
    );
    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND_MESSAGE);
    }
    return project;
  }
}
