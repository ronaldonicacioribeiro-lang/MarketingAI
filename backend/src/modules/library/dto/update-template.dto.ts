import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** DTO de atualização (PATCH /templates/:id), conforme
 * tasks/005_templates.md, Seção 10. Nunca altera `status` — arquivar é
 * ação distinta (POST /templates/:id/archive). */
export class UpdateTemplateDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O nome não pode ficar vazio.' })
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
