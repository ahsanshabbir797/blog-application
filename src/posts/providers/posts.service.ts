import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.schema';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,
    /*
     * Injecting Post Model
     */
    @InjectModel(Post.name)
    private readonly PostModel: Model<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    try {
      const newPost = new this.PostModel(createPostDto);
      return newPost.save();
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  public async findAll() {
    return await this.PostModel.find()
      .populate('tags')
      .populate('author')
      .exec();
  }
}
