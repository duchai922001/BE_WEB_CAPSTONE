import { Injectable, NotFoundException } from '@nestjs/common';
import { VariableRepository } from './variable.repository';
import { CreateVariableDto } from './dtos/create.dto';
import { Variable } from './variable.entity';

@Injectable()
export class VariableService {
  constructor(private readonly variableRepository: VariableRepository) {}

  async create(data: CreateVariableDto): Promise<Variable> {
    return await this.variableRepository.create(data);
  }

  async findById(id: string): Promise<Variable> {
    const variable = await this.variableRepository.findById(id);
    if (!variable) {
      throw new NotFoundException(`Biến thể không tồn tại với ID ${id}`);
    }
    return variable;
  }
}
