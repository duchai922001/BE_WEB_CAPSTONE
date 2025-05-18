import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { VariableRepository } from '../variables/variable.repository';
import { CreateProductDto } from './dtos/create.dto';
import { CreateVariableDto } from '../variables/dtos/create.dto';
import { Product } from './product.entity';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateProductDto } from './dtos/update.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly variableRepository: VariableRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const {
      barCode,
      name,
      description,
      costPrice,
      sellPrice,
      variablesProduct,
      brandId,
      categoryId,
      isSerial,
      listImage,
      mainImage,
      stock,
      serials,
    } = data;
    let variableIds: string[] = [];
    let finalCostPrice = costPrice;
    let finalSellPrice = sellPrice;
    let finalMainImage = mainImage;
    let finalListImage = listImage;
    let finalStock = stock;
    if (variablesProduct?.length) {
      const createVariables = await Promise.all(
        variablesProduct.map(async (variable: CreateVariableDto) => {
          const createdVariable =
            await this.variableRepository.create(variable);
          return createdVariable;
        }),
      );
      variableIds = createVariables.map((variable) => String(variable._id));
      const totalCost = createVariables.reduce(
        (sum, v) => sum + (v.costPrice || 0),
        0,
      );
      const totalSell = createVariables.reduce(
        (sum, v) => sum + (v.sellPrice || 0),
        0,
      );
      const length = createVariables.length;

      finalCostPrice = totalCost / length;
      finalSellPrice = totalSell / length;

      const totalStock = createVariables.reduce(
        (sum, v) => sum + (v.stock || 0),
        0,
      );
      finalStock = totalStock;

      const firstInStock = createVariables.find((v) => v.stock > 0);
      if (firstInStock) {
        finalMainImage = firstInStock.mainImage || finalMainImage;
        finalListImage = firstInStock.listImage || finalListImage;
      }
    } else if (!costPrice) {
      throw new BadRequestException('Cost Price is required');
    }
    if (isSerial && !serials?.length) {
      throw new BadRequestException(
        'Serials are required when isSerial is true',
      );
    }
    return await this.productRepository.create({
      barCode,
      name,
      description,
      costPrice: finalCostPrice,
      sellPrice: finalSellPrice,
      brandId,
      categoryId,
      isSerial,
      listImage: finalListImage,
      mainImage: finalMainImage,
      stock: finalStock,
      serials,
      variables: variableIds || [],
    });
  }

  async getList(query: BaseQueryDto) {
    const products = await this.productRepository.find(query);
    const total = await this.productRepository.count(query);
    return {
      products,
      total,
    };
  }

  async softDelete(id: string): Promise<Product> {
    return this.productRepository.softDelete(id);
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.update(id, data);
    return product;
  }
}
