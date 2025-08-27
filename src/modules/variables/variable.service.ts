import { Injectable, NotFoundException } from '@nestjs/common';
import { VariableRepository } from './variable.repository';
import { CreateVariableDto } from './dtos/create.dto';
import { Variable } from './variable.entity';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { SerialService } from '../serials/serial.service';
import { AttributeService } from '../attributes/attribute.service';
import { UpdateVariableDto } from './dtos/update.dto';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class VariableService {
  constructor(
    private readonly variableRepository: VariableRepository,
    private readonly serialService: SerialService,
    private readonly attributeService: AttributeService,
    private readonly productRepo: ProductRepository,
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

  async findById(id: string) {
    const variable = await this.variableRepository.findById(id);
    if (!variable) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    const serialCodes = await this.serialService.findByVariableId(
      String((variable as any)._id),
    );
    return {
      ...variable.toObject(),
      serialCodes,
    };
  }

  async findByProductId(productId: string): Promise<any[]> {
    const variables = await this.variableRepository.findByProductId(productId);
    return variables;
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

  async updateFields(variableId: string, dto: UpdateVariableDto) {
    const stock =
      dto.typeProduct === '400' ? dto.serialCodes?.length || 0 : undefined;
    const updated = await this.variableRepository.update(variableId, {
      ...dto,
      ...(stock !== undefined && { stock }),
    });
    const newSerials = dto.serialCodes?.filter((s) => s.action === 'new') || [];
    if (dto.typeProduct === '400' && dto.serialCodes?.length) {
      for (const s of dto.serialCodes) {
        if (s.action === 'new') {
          await this.serialService.create({
            productId: dto.productId,
            variableId,
            serialCode: s.serialCode,
          });
        } else if (s.action === 'edit' && s.id) {
          await this.serialService.updateById(s.id, {
            serialCode: s.serialCode,
          });
        }
      }
    }
    if (newSerials.length > 0) {
      await this.productRepo.increaseStock(dto.productId, newSerials.length);
    }
    if (dto.typeProduct === '300' && dto.stock !== undefined) {
      await this.productRepo.updateById(dto.productId, {
        stock: dto.stock,
      });
    }
    if (!updated) throw new NotFoundException('Variable not found');

    return updated;
  }
}
