import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from '../tag.schema';
import { Model } from 'mongoose';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject the tag model
     */
    @InjectModel(Tag.name)
    private readonly TagModel: Model<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    try {
      const newTag = new this.TagModel(createTagDto);
      return await newTag.save();
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
