import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHashTagDto } from './dtos/create.dto';
import { HashTagRepository } from './hashtag.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class HashTagService {
  constructor(private readonly hashtagRepository: HashTagRepository) {}

  async create(dto: CreateHashTagDto) {
    return this.hashtagRepository.create(dto);
  }

  async findAll() {
    return this.hashtagRepository.findAll();
  }

  async findById(id: string) {
    const serial = await this.hashtagRepository.findById(id);
    if (!serial) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return serial;
  }
}
