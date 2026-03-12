import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { TagsService } from 'src/tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UserService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**
     * Inject tags service
     */
    private readonly tagsService: TagsService,
    /**
     * Inject users service
     */
    private readonly usersService: UserService,
    /**
     * Inject posts repository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto, user: IActiveUserData) {
    let author: User | undefined = undefined;
    let tags: Tag[] | undefined = undefined;
    try {
      tags = await this.tagsService.findMultiple(createPostDto.tags ?? []);

      author = (await this.usersService.findOneById(user.sub)) as
        | User
        | undefined;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Please provide a unique slug id',
      });
    }
  }
}
