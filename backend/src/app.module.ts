import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ClientsModule } from '@/modules/clients/clients.module';
import { LibraryModule } from '@/modules/library/library.module';
import { ProjectsModule } from '@/modules/projects/projects.module';
import { UsersModule } from '@/modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    ProjectsModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
