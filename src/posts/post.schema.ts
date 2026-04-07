import mongoose, { Document } from 'mongoose';
import { PostStatus, PostType } from './enums/postType.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Tag } from 'src/tags/tag.schema';

@Schema()
export class Post extends Document {
  @Prop({
    type: String,
    isRequired: true,
  })
  title!: string;

  @Prop({
    type: String,
    isRequired: true,
    enum: PostType,
    default: PostType.POST,
  })
  postType!: PostType;

  @Prop({
    type: String,
    isRequired: true,
  })
  slug!: string;

  @Prop({
    type: String,
    isRequired: true,
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

  @Prop({
    type: String,
    isRequired: true,
  })
  content?: string;

  @Prop({
    type: String,
    isRequired: true,
  })
  featuredImageUrl?: string;

  @Prop({
    type: Date,
    isRequired: true,
  })
  publishOn?: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    isRequired: true,
  })
  author!: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }] })
  tags?: Tag[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
