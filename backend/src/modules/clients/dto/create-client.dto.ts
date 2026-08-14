import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** DTO de cadastro de cliente (POST /clients), conforme
 * tasks/003_clientes.md, Seção 8/11. `empresaId` nunca vem do corpo da
 * requisição — é sempre resolvido a partir do usuário autenticado. */
export class CreateClientDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  context?: string;
}
