import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dtos/create.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ProductType } from 'src/common/enums/productType';
import { ProductImageService } from '../productImage/productImage.service';
import { SerialService } from '../serials/serial.service';
import { VariableService } from '../variables/variable.service';
import { UpdateProductDto } from './dtos/update.dto';
import { CategoryRepository } from '../categories/category.repository';
import {
  ProductByCategoryDto,
  SimpleProductDto,
} from './dtos/product-format-category.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { BrandRepository } from '../brands/brand.repository';
import { ProductDetailDto } from './dtos/product-detail.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageService: ProductImageService,
    private readonly serialService: SerialService,
    private readonly variableService: VariableService,
    private readonly categoryRepo: CategoryRepository,
    private readonly brandRepo: BrandRepository,
  ) {}
  private async handleImages(
    productId: string,
    mainImage?: string,
    listImage?: string[],
  ) {
    if (mainImage) {
      await this.productImageService.create({
        productId,
        url: mainImage,
        isDefault: true,
      });
    }

    if (Array.isArray(listImage) && listImage.length > 0) {
      await Promise.all(
        listImage.map((image) =>
          this.productImageService.create({
            productId,
            url: image,
            isDefault: false,
          }),
        ),
      );
    }
  }
  async create(dto: CreateProductDto) {
    const {
      barcode,
      brandId,
      categoryId,
      name,
      variables,
      costPrice,
      description,
      sellPrice,
      serials,
      stock,
      listImage,
      mainImage,
      typeProduct,
    } = dto;

    const productExited = await this.productRepository.findProductByName(name);
    if (productExited) {
      throw new BadRequestException(ResponseMessage.FILE_EXITED_NAME);
    }
    switch (typeProduct) {
      case ProductType.NO_VARIABLE_NO_SERIAL: {
        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          costPrice: costPrice ?? 0,
          name,
          sellPrice: sellPrice ?? 0,
          stock: stock ?? 0,
          typeProduct,
          description,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        break;
      }
      case ProductType.NORMAL_SERIALS: {
        if (!serials) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} serials`,
          );
        }

        const product = await this.productRepository.create({
          barcode: dto.barcode,
          brandId,
          categoryId,
          costPrice: costPrice ?? 0,
          name,
          sellPrice: sellPrice ?? 0,
          stock: serials?.length ?? 0,
          typeProduct,
          description,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        await Promise.all(
          serials?.map((serial) =>
            this.serialService.create({
              productId: (product._id as any).toString(),
              serialCode: serial,
              description: '',
            }),
          ),
        );
        break;
      }
      case ProductType.NORMAL_VARIABLES: {
        if (variables.length < 0) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} variables`,
          );
        }
        const totalStock = variables.reduce(
          (sum, v) => sum + (v.stock ?? 0),
          0,
        );
        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          costPrice: variables?.[0]?.costPrice,
          name,
          sellPrice: variables?.[0]?.sellPrice,
          stock: totalStock,
          typeProduct,
          description,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        await Promise.all(
          variables.map((item) =>
            this.variableService.create({
              attributes: item.attributes,
              costPrice: item.costPrice,
              sellPrice: item.sellPrice,
              image: item.image,
              productId: (product as any)._id.toString(),
              description: item.description,
              serials: [],
              stock: item.stock,
            }),
          ),
        );
        break;
      }
      case ProductType.NORMAL_VARIABLES_SERIALS: {
        if (variables.length < 0) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} variables`,
          );
        }
        if (serials && serials?.length < 0) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} serials`,
          );
        }
        const totalStock = variables.reduce(
          (sum, item) => sum + (item.serials?.length || 0),
          0,
        );
        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          costPrice: 0,
          name,
          sellPrice: 0,
          stock: totalStock,
          typeProduct,
          description,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );

        await Promise.all(
          variables.map((item) =>
            this.variableService.create({
              attributes: item.attributes,
              costPrice: item.costPrice,
              sellPrice: item.sellPrice,
              image: item.image,
              productId: (product as any)._id.toString(),
              description: item.description,
              serials: item.serials,
              stock: item.serials?.length,
            }),
          ),
        );
        break;
      }
      default:
        throw new BadRequestException(
          `${ResponseMessage.TYPE_NOT_FOUND} ${typeProduct}`,
        );
    }
  }

  async update(productId: string, dto: UpdateProductDto) {
    const {
      barcode,
      brandId,
      categoryId,
      name,
      variables,
      costPrice,
      description,
      sellPrice,
      serials,
      stock,
      listImage,
      mainImage,
      typeProduct,
    } = dto;

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    if (!name) {
      throw new BadRequestException(`${ResponseMessage.REQUIRED_FIELD} name`);
    }
    const productExited = await this.productRepository.findProductByName(name);
    if (productExited && (productExited as any)._id.toString() !== productId) {
      throw new BadRequestException(ResponseMessage.FILE_EXITED_NAME);
    }

    switch (typeProduct) {
      case ProductType.NO_VARIABLE_NO_SERIAL: {
        await this.productRepository.updateById(productId, {
          barcode,
          brandId,
          categoryId,
          costPrice: costPrice ?? 0,
          name,
          sellPrice: sellPrice ?? 0,
          stock: stock ?? 0,
          typeProduct,
          description,
        });
        break;
      }

      case ProductType.NORMAL_SERIALS: {
        if (!serials) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} serials`,
          );
        }

        await this.productRepository.updateById(productId, {
          barcode,
          brandId,
          categoryId,
          costPrice: costPrice ?? 0,
          name,
          sellPrice: sellPrice ?? 0,
          stock: serials.length,
          typeProduct,
          description,
        });

        await this.serialService.deleteByProductId(productId);
        await Promise.all(
          serials.map((serial) =>
            this.serialService.create({
              productId,
              serialCode: serial,
              description: '',
            }),
          ),
        );
        break;
      }

      case ProductType.NORMAL_VARIABLES: {
        if (!variables || variables.length === 0) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} variables`,
          );
        }

        const totalStock = variables.reduce(
          (sum, v) => sum + (v.stock ?? 0),
          0,
        );

        await this.productRepository.updateById(productId, {
          barcode,
          brandId,
          categoryId,
          costPrice: variables?.[0]?.costPrice,
          name,
          sellPrice: variables?.[0]?.sellPrice,
          stock: totalStock,
          typeProduct,
          description,
        });

        await this.variableService.deleteByProductId(productId);
        await Promise.all(
          variables.map((item) =>
            this.variableService.create({
              attributes: item.attributes,
              costPrice: item.costPrice,
              sellPrice: item.sellPrice,
              image: item.image,
              productId,
              description: item.description,
              serials: [],
              stock: item.stock,
            }),
          ),
        );
        break;
      }

      case ProductType.NORMAL_VARIABLES_SERIALS: {
        if (!variables || variables.length === 0) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} variables`,
          );
        }

        const totalStock = variables.reduce(
          (sum, item) => sum + (item.serials?.length || 0),
          0,
        );

        await this.productRepository.updateById(productId, {
          barcode,
          brandId,
          categoryId,
          costPrice: 0,
          name,
          sellPrice: 0,
          stock: totalStock,
          typeProduct,
          description,
        });

        await this.variableService.deleteByProductId(productId);
        await Promise.all(
          variables.map((item) =>
            this.variableService.create({
              attributes: item.attributes,
              costPrice: item.costPrice,
              sellPrice: item.sellPrice,
              image: item.image,
              productId,
              description: item.description,
              serials: item.serials,
              stock: item.serials?.length || 0,
            }),
          ),
        );
        break;
      }

      default:
        throw new BadRequestException(
          `${ResponseMessage.TYPE_NOT_FOUND} ${typeProduct}`,
        );
    }

    // Cập nhật hình ảnh (nếu có)
    await this.handleImages(productId, mainImage, listImage);
  }

  async getProductsFormCategory(): Promise<ProductByCategoryDto[]> {
    const products = await this.productRepository.findAll();

    const grouped: Record<string, any[]> = {};
    const productIds: string[] = [];

    for (const product of products) {
      const p = product as {
        _id: Types.ObjectId;
        categoryId: Types.ObjectId | string;
        brandId: Types.ObjectId | string;
      };

      const categoryId = p.categoryId.toString();

      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }

      grouped[categoryId].push(p);
      productIds.push(p._id.toString());
    }

    const categoryIds = Object.keys(grouped);
    const categories = await this.categoryRepo.findManyByIds(categoryIds);
    const productImages =
      await this.productImageService.findDefaultByProductIds(productIds);

    const imageMap: Record<string, string> = {};
    for (const image of productImages) {
      imageMap[image.productId.toString()] = image.url;
    }

    const result: ProductByCategoryDto[] = [];

    for (const category of categories) {
      const categoryId = (category._id as Types.ObjectId).toString();
      const rawProducts = grouped[categoryId] || [];

      const simplifiedProducts: SimpleProductDto[] = rawProducts.map((p) => ({
        id: p._id,
        name: p.name,
        sellPrice: p.sellPrice,
        image: imageMap[p._id.toString()] || null,
      }));

      const brandIds = [
        ...new Set(
          rawProducts.map((p) => p.brandId?.toString()).filter(Boolean),
        ),
      ];
      const brands = await this.brandRepo.findManyByIds(brandIds);

      result.push(
        plainToInstance(ProductByCategoryDto, {
          categoryName: category.name,
          products: simplifiedProducts,
          brands: brands.map((b) => b.name),
        }),
      );
    }

    return result;
  }

  async getProductDetailById(productId: string): Promise<ProductDetailDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);

    const [category, brand] = await Promise.all([
      this.categoryRepo.findById(String(product.categoryId)),
      this.brandRepo.findById(String(product.brandId)),
    ]);

    const images = await this.productImageService.findByProductId(productId);
    const variables = await this.variableService.findByProductId(productId);

    return plainToInstance(ProductDetailDto, {
      id: (product as any)._id.toString(),
      name: product.name,
      description: product.description,
      sellPrice: product.sellPrice,
      listImage: images.map((img) => img.url),
      variables,
      brands: brand?.name || '',
      categoryName: category?.name || '',
    });
  }

  async searchProducts(query: BaseQueryDto) {
    return this.productRepository.search(query);
  }
}
