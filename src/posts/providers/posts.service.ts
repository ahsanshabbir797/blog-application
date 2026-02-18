import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UserService;
    @InjectRepository(Post)
    private readonly postsRepository: Repository(Post)
  ) {}
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    console.log(userId);
    return [
      {
        user: user,
        title: 'First title',
        content: 'first content',
      },
      {
        user: user,
        title: 'second title',
        content: 'second content',
      },
    ];
  }
}
