import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Papel do usuário. Nesta sprint existe apenas um valor possível
 * (administrador), conforme tasks/001_autenticacao.md (Seção 9):
 * "extensível sem redesenho quando outros papéis forem justificados
 * por uma sprint futura".
 */
export enum UserRole {
  ADMIN = 'admin',
}

export type UserDocument = HydratedDocument<User>;

/**
 * Usuário — conforme docs/05_DATABASE.md: "Ser o ponto de autoria de
 * decisões humanas (...) Pertence a uma Empresa."
 *
 * A senha nunca é armazenada em texto puro (apenas passwordHash, com
 * bcrypt) e nunca é retornada por padrão (select: false).
 */
@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Empresa', required: true })
  empresaId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
