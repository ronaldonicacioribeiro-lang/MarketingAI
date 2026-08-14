import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  NON_TERMINAL_PROJECT_STATUSES,
  ProjectStatus,
} from '../schemas/project.schema';

/**
 * DTO de atualização (PATCH /projects/:id), conforme
 * tasks/004_projetos.md, Seção 9/12. `status` só aceita os quatro
 * valores não terminais — `concluido` é rejeitado aqui pela própria
 * validação (`@IsIn`); alcançá-lo exige a ação distinta de encerramento
 * (POST /projects/:id/close).
 */
export class UpdateProjectDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O nome não pode ficar vazio.' })
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'O objetivo não pode ficar vazio.' })
  @IsString()
  objective?: string;

  @IsOptional()
  @IsIn(NON_TERMINAL_PROJECT_STATUSES, {
    message:
      'Estado inválido para atualização direta. Use a ação de encerramento para concluir o projeto.',
  })
  status?: ProjectStatus;
}
