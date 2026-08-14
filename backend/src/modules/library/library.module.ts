import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Template, TemplateSchema } from './schemas/template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
