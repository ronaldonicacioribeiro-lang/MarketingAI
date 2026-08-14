import { IsNotEmpty, IsString } from 'class-validator';

/** DTO de cadastro de projeto (POST /clients/:clientId/projects), conforme
 * tasks/004_projetos.md, Seção 9/12. `clientId` vem sempre da URL, nunca
 * do corpo; `empresaId` nunca vem do corpo — ambos resolvidos no backend. */
export class CreateProjectDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O objetivo é obrigatório.' })
  @IsString()
  objective: string;
}
