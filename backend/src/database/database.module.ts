import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Conexão Mongoose com o MongoDB Atlas, pronta para uso a partir da Sprint 1.
 *
 * Não importado em AppModule nesta Sprint 0: sem um MONGODB_URI real configurado
 * em .env, tentar conectar quebraria a inicialização limpa exigida na Sprint 0.
 * Basta importar este módulo em AppModule assim que houver uma URI válida.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
