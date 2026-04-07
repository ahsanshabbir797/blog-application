import { Body, Controller, Post } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(
    /**
     * Inject the tag service
     */
    private readonly tagService: TagsService,
  ) {}

  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }
}
