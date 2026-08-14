import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** DTO de atualização de contexto (PATCH /clients/:id), conforme
 * tasks/003_clientes.md, Seção 8/11. Nunca altera `status` — arquivar é
 * uma ação de negócio separada (POST /clients/:id/archive). */
export class UpdateClientContextDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O nome não pode ficar vazio.' })
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  context?: string;
}
