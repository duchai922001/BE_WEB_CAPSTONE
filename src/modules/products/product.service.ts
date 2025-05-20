import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { VariableRepository } from '../variables/variable.repository';
import { CreateProductDto } from './dtos/create.dto';
import { CreateVariableDto } from '../variables/dtos/create.dto';
import { Product, ProductDocument } from './product.entity';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateProductDto } from './dtos/update.dto';
import { VariableDocument } from '../variables/variable.entity';
import { Types } from 'mongoose';
import { DeleteListProductDto } from './dtos/delete-list.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly variableRepository: VariableRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const {
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
      isVariable,
      barcode,
    } = data;

    // TH có biến thể
    if (isVariable) {
      if (!variablesProduct?.length) {
        throw new BadRequestException(
          'Variable products are required when isVariable is true',
        );
      }

      const variableIds: string[] = [];
      let finalAggregatedCostPrice = 0;
      let finalAggregatedSellPrice = 0;
      let finalAggregatedStock = 0;
      let finalMainImage = mainImage;
      let finalListImage = listImage;

      const createVariables = await Promise.all(
        variablesProduct.map(async (variable: CreateVariableDto) => {
          if (
            typeof variable.costPrice !== 'number' ||
            typeof variable.sellPrice !== 'number'
          ) {
            throw new BadRequestException(
              `Cost price and sell price are required for each variable. Attribute: ${JSON.stringify(variable.attribute)}`,
            );
          }
          if (
            variable.isSerial &&
            (!variable.serials || variable.serials.length === 0)
          ) {
            throw new BadRequestException(
              `Serials are required for variable with attribute: ${JSON.stringify(variable.attribute)} when isSerial is true`,
            );
          }
          if (
            variable.isSerial &&
            variable.serials &&
            variable.serials.length !== variable.stock
          ) {
            throw new BadRequestException(
              `Number of serials (${variable.serials.length}) must match the stock (${variable.stock}) for variable with attribute: ${JSON.stringify(variable.attribute)}`,
            );
          }

          const createdVariable = await this.variableRepository.create({
            ...variable,
            isSerial: variable.isSerial || false,
            serials: variable.serials || [],
          });
          return createdVariable;
        }),
      );

      variableIds.push(
        ...createVariables.map((variable) => String(variable._id)),
      );

      if (createVariables.length > 0) {
        const totalCost = createVariables.reduce(
          (sum, v) => sum + v.costPrice,
          0,
        );
        const totalSell = createVariables.reduce(
          (sum, v) => sum + v.sellPrice,
          0,
        );
        finalAggregatedCostPrice = totalCost / createVariables.length;
        finalAggregatedSellPrice = totalSell / createVariables.length;
        finalAggregatedStock = createVariables.reduce(
          (sum, v) => sum + (v.stock || 0),
          0,
        );

        const firstInStockVariableWithImage = createVariables.find(
          (v) => v.stock > 0 && v.mainImage,
        );
        if (firstInStockVariableWithImage) {
          finalMainImage = firstInStockVariableWithImage.mainImage;
          finalListImage = firstInStockVariableWithImage.listImage || [];
        } else {
          finalMainImage = mainImage || createVariables[0]?.mainImage || '';
          finalListImage = listImage || createVariables[0]?.listImage || [];
        }
      }

      return await this.productRepository.create({
        name,
        description,
        costPrice: finalAggregatedCostPrice,
        sellPrice: finalAggregatedSellPrice,
        brandId,
        categoryId,
        isSerial: false,
        listImage: finalListImage,
        mainImage: finalMainImage,
        stock: finalAggregatedStock,
        serials: [],
        variables: variableIds,
        isVariable: true,
        barcode,
      });
    }
    // TH không có biến thể
    else {
      if (typeof data.costPrice !== 'number') {
        throw new BadRequestException(
          'Cost Price is required and must be a number for non-variable products.',
        );
      }
      if (typeof data.sellPrice !== 'number') {
        throw new BadRequestException(
          'Sell Price is required and must be a number for non-variable products.',
        );
      }
      if (typeof data.stock !== 'number') {
        throw new BadRequestException(
          'Stock is required and must be a number for non-variable products.',
        );
      }

      if (isSerial === true) {
        if (!serials || serials.length === 0) {
          throw new BadRequestException(
            'Serials are required for non-variable product when isSerial is true.',
          );
        }
        if (typeof stock !== 'number') {
          throw new BadRequestException(
            'Stock must be a number when product is serial and non-variable.',
          );
        }
        if (serials.length !== stock) {
          throw new BadRequestException(
            `Number of serials (${serials.length}) must match the product stock (${stock}) when product is serial and non-variable.`,
          );
        }
      } else {
        if (serials && serials.length > 0) {
          throw new BadRequestException(
            'Serials should be empty for non-variable product when isSerial is false.',
          );
        }
      }

      return await this.productRepository.create({
        name,
        description,
        costPrice: costPrice,
        sellPrice: sellPrice,
        brandId,
        categoryId,
        isSerial: isSerial || false,
        listImage,
        mainImage,
        stock: stock,
        serials: isSerial ? serials || [] : [],
        variables: [],
        isVariable: false,
        barcode,
      });
    }
  }

  async getList(query: BaseQueryDto) {
    const products = await this.productRepository.find(query);
    const total = await this.productRepository.count(query);
    return {
      products,
      total,
    };
  }

  async getProductDetail(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product not found with id ${id}`);
    }

    if (product.variables && product.variables.length > 0) {
      const populatedVariables = await Promise.all(
        product.variables.map(async (variableId) => {
          try {
            return await this.variableRepository.findById(
              variableId.toString(),
            );
          } catch (error) {
            console.error(
              `Error fetching variable with ID ${variableId.toString()}:`,
              error,
            );
            return null;
          }
        }),
      );
      product.variables = populatedVariables.filter((v) => v !== null) as any;
    }

    return product;
  }

  async getSerials(payload: { productId: string; variableId?: string }) {
    const { productId, variableId } = payload;
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.serials && product.serials.length > 0) {
      return product.serials;
    }
    if (product.isVariable && variableId) {
      const variable = await this.variableRepository.findById(variableId);
      if (!variable) {
        throw new NotFoundException('Variable not found');
      }
      return variable.serials || [];
    }
    return [];
  }

  async getVariables(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.variables.length) {
      const variableData = await Promise.all(
        product.variables.map(async (variableId) => {
          const variable = await this.variableRepository.findById(
            variableId.toString(),
          );
          if (!variable) return null;
          return variable;
        }),
      );

      return variableData.filter((v) => v !== null);
    }
    return [];
  }

  async softDelete(id: string): Promise<Product> {
    return this.productRepository.softDelete(id);
  }

  async deleteListProductsSoft(dto: DeleteListProductDto): Promise<void> {
    const { ids } = dto;

    const products = await this.productRepository.checkProductInListProducts(
      ids as string[],
    );
    if (products.length !== ids.length) {
      const foundIds = products.map((p) =>
        ((p as any)._id as Types.ObjectId).toString(),
      );
      const notFoundIds = (ids as string[]).filter(
        (id) => !foundIds.includes(id),
      );
      throw new NotFoundException(
        `Một vài sản phẩm không tìm thấy: ${notFoundIds.join(', ')}`,
      );
    }

    await this.productRepository.productsSoftDelete(ids);
  }

  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatePayload: Partial<ProductDocument> = {};

    const simpleFields: (keyof UpdateProductDto)[] = [
      'name',
      'description',
      'barcode',
      'brandId',
      'categoryId',
      'mainImage',
      'listImage',
    ];
    simpleFields.forEach((field) => {
      if (data[field] !== undefined) {
        (updatePayload as any)[field] = data[field];
      }
    });

    const isVariableBeingSet = data.isVariable !== undefined;
    const currentIsVariable = isVariableBeingSet
      ? data.isVariable
      : existingProduct.isVariable;

    if (currentIsVariable) {
      updatePayload.isVariable = true;
      updatePayload.isSerial = false;
      updatePayload.serials = [];

      if (data.variablesProduct && data.variablesProduct.length > 0) {
        const variableIds: string[] = [];
        const processedVariables: VariableDocument[] = await Promise.all(
          data.variablesProduct.map(
            async (
              variableData: Partial<CreateVariableDto & { _id?: string }>,
            ) => {
              if (
                typeof variableData.costPrice !== 'number' ||
                typeof variableData.sellPrice !== 'number'
              ) {
                throw new BadRequestException(
                  `Cost price and sell price are required for each variable. Attribute: ${JSON.stringify(variableData.attribute)}`,
                );
              }
              if (
                variableData.isSerial &&
                (!variableData.serials || variableData.serials.length === 0)
              ) {
                throw new BadRequestException(
                  `Serials are required for variable with attribute: ${JSON.stringify(variableData.attribute)} when isSerial is true`,
                );
              }
              if (
                variableData.isSerial &&
                variableData.serials &&
                variableData.serials.length !== variableData.stock
              ) {
                throw new BadRequestException(
                  `Number of serials (${variableData.serials.length}) must match stock (${variableData.stock}) for variable: ${JSON.stringify(variableData.attribute)}`,
                );
              }

              if (variableData._id) {
                const updatedVar = await this.variableRepository.update(
                  variableData._id,
                  {
                    ...variableData,
                    isSerial: variableData.isSerial || false,
                    serials: variableData.serials || [],
                  },
                );
                if (!updatedVar)
                  throw new NotFoundException(
                    `Variable with ID ${variableData._id} not found during update.`,
                  );
                return updatedVar as VariableDocument;
              } else {
                const newVarData: CreateVariableDto = {
                  attribute: variableData.attribute!,
                  costPrice: variableData.costPrice,
                  sellPrice: variableData.sellPrice,
                  stock: variableData.stock || 0,
                  description: variableData.description || '',
                  isSerial: variableData.isSerial || false,
                  serials: variableData.serials || [],
                  mainImage: variableData.mainImage,
                  listImage: variableData.listImage,
                };
                return (await this.variableRepository.create(
                  newVarData,
                )) as VariableDocument;
              }
            },
          ),
        );

        variableIds.push(
          ...processedVariables.map((v: VariableDocument) =>
            ((v as any)._id as Types.ObjectId).toString(),
          ),
        );
        updatePayload.variables = variableIds as any[];

        if (processedVariables.length > 0) {
          const totalCost = processedVariables.reduce(
            (sum, v) => sum + v.costPrice,
            0,
          );
          const totalSell = processedVariables.reduce(
            (sum, v) => sum + v.sellPrice,
            0,
          );
          updatePayload.costPrice = totalCost / processedVariables.length;
          updatePayload.sellPrice = totalSell / processedVariables.length;
          updatePayload.stock = processedVariables.reduce(
            (sum, v) => sum + (v.stock || 0),
            0,
          );

          if (data.mainImage === undefined || data.listImage === undefined) {
            const firstInStockVarWithImage = processedVariables.find(
              (v) => v.stock > 0 && v.mainImage,
            );
            if (firstInStockVarWithImage) {
              if (data.mainImage === undefined)
                updatePayload.mainImage = firstInStockVarWithImage.mainImage;
              if (data.listImage === undefined)
                updatePayload.listImage =
                  firstInStockVarWithImage.listImage || [];
            } else if (processedVariables[0]) {
              if (data.mainImage === undefined)
                updatePayload.mainImage =
                  processedVariables[0].mainImage || existingProduct.mainImage;
              if (data.listImage === undefined)
                updatePayload.listImage =
                  processedVariables[0].listImage || existingProduct.listImage;
            }
          }
        }
      } else if (
        isVariableBeingSet &&
        data.isVariable === true &&
        (!data.variablesProduct || data.variablesProduct.length === 0)
      ) {
        if (!existingProduct.isVariable && data.isVariable === true) {
          throw new BadRequestException(
            'Variable products are required when transitioning to a variable product.',
          );
        }
        if (existingProduct.isVariable) {
          updatePayload.variables = existingProduct.variables;
          updatePayload.costPrice = existingProduct.costPrice;
          updatePayload.sellPrice = existingProduct.sellPrice;
          updatePayload.stock = existingProduct.stock;
        }
      }

      if (!data.variablesProduct && existingProduct.isVariable) {
        updatePayload.variables = existingProduct.variables;
        if (data.costPrice === undefined)
          updatePayload.costPrice = existingProduct.costPrice;
        if (data.sellPrice === undefined)
          updatePayload.sellPrice = existingProduct.sellPrice;
        if (data.stock === undefined)
          updatePayload.stock = existingProduct.stock;
      }
    } else {
      updatePayload.isVariable = false;
      updatePayload.variables = [];

      if (data.costPrice !== undefined)
        updatePayload.costPrice = data.costPrice;
      else if (isVariableBeingSet)
        throw new BadRequestException(
          'Cost Price is required for non-variable products.',
        );

      if (data.sellPrice !== undefined)
        updatePayload.sellPrice = data.sellPrice;
      else if (isVariableBeingSet)
        throw new BadRequestException(
          'Sell Price is required for non-variable products.',
        );

      if (data.stock !== undefined) updatePayload.stock = data.stock;
      else if (isVariableBeingSet)
        throw new BadRequestException(
          'Stock is required for non-variable products.',
        );

      const productIsSerial =
        data.isSerial !== undefined ? data.isSerial : existingProduct.isSerial;
      if (data.isSerial !== undefined) updatePayload.isSerial = data.isSerial;

      if (productIsSerial) {
        if (data.serials !== undefined) {
          if (
            data.serials.length !==
            (updatePayload.stock ?? existingProduct.stock)
          ) {
            throw new BadRequestException(
              `Number of serials must match stock for non-variable serial product.`,
            );
          }
          updatePayload.serials = data.serials;
        } else if (data.isSerial === true) {
          throw new BadRequestException(
            'Serials are required when isSerial is true for a non-variable product.',
          );
        }
      } else {
        updatePayload.serials = [];
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return existingProduct;
    }

    return await this.productRepository.update(id, updatePayload);
  }
}
