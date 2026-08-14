import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '../clients/clients.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import {
  ProjectHistory,
  ProjectHistorySchema,
} from './schemas/project-history.schema';
import { Project, ProjectSchema } from './schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectHistory.name, schema: ProjectHistorySchema },
    ]),
    ClientsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
