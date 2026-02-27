import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';

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
    /**
     * Inject tags service
     */
    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);

    const tags = await this.tagsService.findMultiple(createPostDto.tags ?? []);

    if (author) {
      const post = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tags,
      });
      return await this.postsRepository.save(post);
    }
  }

  public async findAll(userId: string) {
    console.log(userId);
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        //author: true,
        // tags: true,
      }, //alternately we can got for eager loading on the relevant relation in the entity
    });

    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    //find the tags
    let tags: Tag[] | null = null;
    let post: Post | null = null;
    try {
      tags = await this.tagsService.findMultiple(patchPostDto.tags ?? []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    //check if the tags requested are equal to tags received
    if (!tags || tags.length != patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag ids and ensure they are correct',
      );
    }

    //find the post
    try {
      post = await this.postsRepository.findOne({
        where: { id: patchPostDto.id },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
        {
          description: 'Error connecting to the database',
          cause: error,
        },
      );
    }

    if (!post) {
      throw new BadRequestException('The post id does not exist');
    }

    //update the properties
    if (post) {
      post.title = patchPostDto.title ?? post.title;
      post.content = patchPostDto.title ?? post.title;
      post.status = patchPostDto.status ?? post.status;
      post.postType = patchPostDto.postType ?? post.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;
      //assign the tags
      post.tags = tags;

      try {
        await this.postsRepository.save(post);
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment. Please try later.',
          {
            description: 'Error connecting to the database',
            cause: error,
          },
        );
      }

      return post;
    }
    //save the post & return
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return {
      isDeleted: true,
      id,
    };
  }
}
