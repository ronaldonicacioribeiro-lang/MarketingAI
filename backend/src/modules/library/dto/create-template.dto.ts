import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** DTO de cadastro de template (POST /templates), conforme
 * tasks/005_templates.md, Seção 10/13. `empresaId` nunca vem do corpo
 * da requisição — é sempre resolvido a partir do usuário autenticado. */
export class CreateTemplateDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
