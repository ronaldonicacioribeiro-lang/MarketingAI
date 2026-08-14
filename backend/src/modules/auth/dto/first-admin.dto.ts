import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO do bootstrap do primeiro administrador (POST /auth/first-admin),
 * conforme tasks/001_autenticacao.md (Seção 7.2 + Seção 8).
 *
 * O campo `empresaName` foi confirmado como adição necessária: a Seção 9
 * da task exige um campo `name` obrigatório na entidade Empresa, mas nenhum
 * outro ponto do fluxo de bootstrap o coleta — sem este campo, o nome da
 * Empresa teria que ser fabricado, o que a especificação proíbe.
 */
export class FirstAdminDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  password: string;

  @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
  empresaName: string;
}
