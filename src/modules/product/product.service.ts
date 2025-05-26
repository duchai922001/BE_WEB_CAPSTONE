import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dtos/create.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ProductType } from 'src/common/enums/productType';
import { ProductImageService } from '../productImage/productImage.service';
import { SerialService } from '../serials/serial.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageService: ProductImageService,
    private readonly serialService: SerialService,
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
        console.log({ dto });

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
        break;
      }
      case ProductType.NORMAL_VARIABLES_SERIALS: {
        break;
      }
      default:
        throw new BadRequestException(
          `${ResponseMessage.TYPE_NOT_FOUND} ${typeProduct}`,
        );
    }
  }
}
