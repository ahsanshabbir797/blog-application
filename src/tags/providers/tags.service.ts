import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Injecting the tags repository
     */
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  public async findMultiple(tags: number[]) {
    return await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);

    return {
      isDeleted: true,
      id,
    };
  }

  public async softDelete(id: number) {
    await this.tagRepository.softDelete(id);

    return {
      isDeleted: true,
      id,
    };
  }
}
