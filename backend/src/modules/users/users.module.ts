import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, EmpresaSchema } from './schemas/empresa.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Empresa.name, schema: EmpresaSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
