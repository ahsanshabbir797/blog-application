import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    /**
     * Inject MetaOptions Service
     */
    private readonly metaOptionsService: MetaOptionsService,
  ) {}

  @Post()
  public create(@Body() createMetaOptionsDto: CreatePostMetaOptionsDto) {
    return this.metaOptionsService.create(createMetaOptionsDto);
  }
}
