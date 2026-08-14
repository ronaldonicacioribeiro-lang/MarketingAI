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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientContextDto } from './dto/update-client-context.dto';
import { ClientDocument } from './schemas/client.schema';

const CLIENT_NOT_FOUND_MESSAGE = 'Cliente não encontrado.';

function toClientResponse(client: ClientDocument) {
  return {
    id: String(client._id),
    name: client.name,
    context: client.context ?? null,
    status: client.status,
    archivedAt: client.archivedAt,
  };
}

/**
 * Todas as rotas exigem JWT válido e são sempre escopadas à Empresa do
 * usuário autenticado — conforme tasks/003_clientes.md, Seção 11/13.
 * Um id malformado ou de outra Empresa retorna 404 igualmente, nunca
 * revelando se o registro existe em outro escopo.
 */
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: JwtPayload, @Body() dto: CreateClientDto) {
    const client = await this.clientsService.create(
      new Types.ObjectId(user.empresaId),
      dto,
    );
    return toClientResponse(client);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    const clients = await this.clientsService.findAllActive(
      new Types.ObjectId(user.empresaId),
    );
    return clients.map(toClientResponse);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const client = await this.findScopedOrThrow(id, user.empresaId);
    return toClientResponse(client);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateClientContextDto,
  ) {
    await this.findScopedOrThrow(id, user.empresaId);
    const updated = await this.clientsService.updateContext(
      id,
      new Types.ObjectId(user.empresaId),
      dto,
    );
    if (!updated) {
      throw new NotFoundException(CLIENT_NOT_FOUND_MESSAGE);
    }
    return toClientResponse(updated);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  async archive(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.findScopedOrThrow(id, user.empresaId);
    const archived = await this.clientsService.archive(
      id,
      new Types.ObjectId(user.empresaId),
    );
    if (!archived) {
      throw new NotFoundException(CLIENT_NOT_FOUND_MESSAGE);
    }
    return toClientResponse(archived);
  }

  /** Valida o formato do id e a propriedade da Empresa antes de qualquer operação. */
  private async findScopedOrThrow(id: string, empresaId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(CLIENT_NOT_FOUND_MESSAGE);
    }
    const client = await this.clientsService.findOneScoped(
      id,
      new Types.ObjectId(empresaId),
    );
    if (!client) {
      throw new NotFoundException(CLIENT_NOT_FOUND_MESSAGE);
    }
    return client;
  }
}
