import { Injectable, NotFoundException } from '@nestjs/common';
import { VariableRepository } from './variable.repository';
import { CreateVariableDto } from './dtos/create.dto';
import { Variable } from './variable.entity';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { SerialService } from '../serials/serial.service';
import { AttributeService } from '../attributes/attribute.service';

@Injectable()
export class VariableService {
  constructor(
    private readonly variableRepository: VariableRepository,
    private readonly serialService: SerialService,
    private readonly attributeService: AttributeService,
  ) {}

  async create(data: CreateVariableDto): Promise<Variable> {
    const {
      productId,
      attributes,
      costPrice,
      sellPrice,
      description,
      image,
      serials,
      stock,
    } = data;
    const variable = await this.variableRepository.create({
      productId,
      description,
      image,
      costPrice,
      sellPrice,
      stock,
    });
    if (serials && serials.length > 0) {
      await Promise.all(
        serials.map((serial) =>
          this.serialService.create({
            serialCode: serial,
            productId: productId,
            variableId: (variable._id as any).toString(),
          }),
        ),
      );
    }

    if (attributes && attributes.length > 0) {
      await Promise.all(
        attributes.map((attribute) =>
          this.attributeService.create({
            variableId: variable._id,
            key: attribute.key,
            value: attribute.value,
          }),
        ),
      );
    }

    return variable;
  }

  async findById(id: string): Promise<Variable> {
    const variable = await this.variableRepository.findById(id);
    if (!variable) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return variable;
  }

  async findByProductId(productId: string): Promise<any[]> {
    const variables = await this.variableRepository.findByProductId(productId);

    const result = await Promise.all(
      variables.map(async (variable) => {
        const attributes = await this.attributeService.findByVariableId(
          variable._id.toString(),
        );

        return {
          ...(variable.toObject?.() ?? variable),
          attribute: attributes,
        };
      }),
    );

    return result;
  }

  async updateById(id: string, dto: Partial<CreateVariableDto>) {
    const variable = await this.variableRepository.updateById(id, dto);
    if (!variable) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return variable;
  }

  async deleteById(id: string) {
    await this.serialService.deleteByProductId(id);
    await this.attributeService.deleteByVariableId(id);
    await this.variableRepository.deleteById(id);
  }

  async deleteByProductId(productId: string) {
    const variables = await this.findByProductId(productId);
    const variableIds = variables.map((v) => v._id.toString());

    await Promise.all([
      this.serialService.deleteManyByIds(variableIds),
      this.attributeService.deleteManyByVariableIds(variableIds),
    ]);

    await this.variableRepository.deleteByProductId(productId);
  }
}
