import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UserService,
    /**
     * Inject postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    //create metaoptions
    //create post
    //add metaOptions to the post
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    console.log(user);
    const posts = await this.postsRepository.find();
    return posts;
  }

  public async delete(id: number) {
    const post = await this.postsRepository.findOneBy({ id });

    await this.postsRepository.delete(id);

    if (post?.metaOptions?.id) {
      await this.metaOptionsRepository.delete(post?.metaOptions?.id);
    }

    return {
      isDeleted: true,
      id,
    };
  }
}
