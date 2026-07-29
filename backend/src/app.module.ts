import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// DatabaseModule (Mongoose) fica pronto em src/database, mas só é importado
// aqui quando houver um MONGODB_URI real configurado — ver DatabaseModule.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
