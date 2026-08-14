import {
  Body,
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
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { LibraryService } from './library.service';
import { TemplateDocument } from './schemas/template.schema';

const TEMPLATE_NOT_FOUND_MESSAGE = 'Template não encontrado.';

function toTemplateResponse(template: TemplateDocument) {
  return {
    id: String(template._id),
    name: template.name,
    description: template.description ?? null,
    content: template.content ?? null,
    status: template.status,
    archivedAt: template.archivedAt,
  };
}

/**
 * Todas as rotas exigem JWT válido e são sempre escopadas à Empresa do
 * usuário autenticado — mesmo padrão de ClientsController
 * (tasks/003_clientes.md), conforme tasks/005_templates.md, Seção 10/12.
 * Rota usa `/templates` diretamente (não `/library/templates`) — ver
 * Nota de nomenclatura em tasks/005_templates.md, Seção 10.
 */
@Controller('templates')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTemplateDto,
  ) {
    const template = await this.libraryService.create(
      new Types.ObjectId(user.empresaId),
      dto,
    );
    return toTemplateResponse(template);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const templates = await this.libraryService.findAllActive(
      new Types.ObjectId(user.empresaId),
    );
    return templates.map(toTemplateResponse);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const template = await this.findScopedOrThrow(id, user.empresaId);
    return toTemplateResponse(template);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    await this.findScopedOrThrow(id, user.empresaId);
    const updated = await this.libraryService.update(
      id,
      new Types.ObjectId(user.empresaId),
      dto,
    );
    if (!updated) {
      throw new NotFoundException(TEMPLATE_NOT_FOUND_MESSAGE);
    }
    return toTemplateResponse(updated);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archive(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.findScopedOrThrow(id, user.empresaId);
    const archived = await this.libraryService.archive(
      id,
      new Types.ObjectId(user.empresaId),
    );
    if (!archived) {
      throw new NotFoundException(TEMPLATE_NOT_FOUND_MESSAGE);
    }
    return toTemplateResponse(archived);
  }

  /** Valida o formato do id e a propriedade da Empresa antes de qualquer operação. */
  private async findScopedOrThrow(id: string, empresaId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(TEMPLATE_NOT_FOUND_MESSAGE);
    }
    const template = await this.libraryService.findOneScoped(
      id,
      new Types.ObjectId(empresaId),
    );
    if (!template) {
      throw new NotFoundException(TEMPLATE_NOT_FOUND_MESSAGE);
    }
    return template;
  }
}
