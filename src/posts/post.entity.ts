import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { PostStatus, PostType } from './enums/postType.enum';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  tags?: Array<string>;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  metaOptions?: CreatePostMetaOptionsDto[];
}
