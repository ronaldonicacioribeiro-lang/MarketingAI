import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Marcado @Global() para que JwtAuthGuard fique disponível a qualquer
 * módulo (ex.: UsersModule, em GET /users/me) sem exigir que esses módulos
 * importem AuthModule de volta — evitando um ciclo de importação entre
 * AuthModule (que precisa de UsersModule para checar/criar usuários) e
 * UsersModule (que precisa do guard para proteger sua própria rota).
 */
@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          // @nestjs/jwt tipa expiresIn como `number | StringValue` (do
          // pacote `ms`); JWT_EXPIRES_IN vem do .env como string simples
          // (ex.: "1d"), por isso o cast — comportamento em runtime não muda.
          expiresIn: configService.get<string>('jwt.expiresIn') as never,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
