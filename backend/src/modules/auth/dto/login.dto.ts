import { IsEmail, IsNotEmpty } from 'class-validator';

/** DTO de login (POST /auth/login), conforme tasks/001_autenticacao.md (Seção 7.1). */
export class LoginDto {
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string;
}
