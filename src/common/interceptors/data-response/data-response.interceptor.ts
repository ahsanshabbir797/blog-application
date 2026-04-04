import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('BEFORE');
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.configService.get<string>('appConfig.apiVersion'),
        data: data,
      })),
    );
  }
}
