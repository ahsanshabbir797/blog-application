import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    isRequired: true,
  })
  firstName!: string;
  @Prop({
    type: String,
    isRequired: false,
  })
  lastName?: string;
  @Prop({
    type: String,
    isRequired: true,
  })
  email!: string;
  @Prop({
    type: String,
    isRequired: true,
  })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
