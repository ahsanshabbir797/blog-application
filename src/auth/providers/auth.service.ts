import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public login(id: string, email: string, password: string) {
    const user = this.userService.findOneById('1234');
    console.log('Logged in user:::', user);
    return 'SAMPLE TOKEN';
  }

  public isAuth() {
    return true;
  }
}
