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
import { SerialCodeDto, UpdateProductDto } from './dtos/update.dto';
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
import { SpecificationsService } from '../specifications/specifications.service';
import { PromotionRepository } from '../promotion/promotion.repository';
import { SpecificationsRepository } from '../specifications/specifications.repository';
import { FilterProductDto } from './dtos/filter.dto';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { SerialRepository } from '../serials/serial.repository';
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productImageService: ProductImageService,
    private readonly serialService: SerialService,
    private readonly serialRepo: SerialRepository,
    private readonly variableService: VariableService,
    private readonly categoryRepo: CategoryRepository,
    private readonly brandRepo: BrandRepository,
    private readonly speciSer: SpecificationsService,
    private readonly speciRepo: SpecificationsRepository,
    private readonly promotionRepo: PromotionRepository,
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
      isInstallment,
      specifications,
      productWarrantyPolicyId,
    } = dto;
    const productExitedByBarcode =
      await this.productRepository.findProductByBarcode(barcode);
    if (productExitedByBarcode) {
      throw new BadRequestException('Barcode đã tồn tại');
    }
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
          isInstallment,
          productWarrantyPolicyId,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        if (specifications?.length > 0) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }
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
          isInstallment,
          productWarrantyPolicyId,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        if (specifications?.length > 0) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }
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
          isInstallment,
          productWarrantyPolicyId,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        if (specifications?.length > 0) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }
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
          costPrice: variables?.[0]?.costPrice,
          name,
          sellPrice: variables?.[0]?.sellPrice,
          stock: totalStock,
          typeProduct,
          description,
          isInstallment,
          productWarrantyPolicyId,
        });
        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );
        if (specifications?.length > 0) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }
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
      isInstallment,
      costPrice,
      description,
      sellPrice,
      stock,
    } = dto;

    const product = await this.productRepository.updateById(productId, {
      barcode,
      brandId,
      categoryId,
      name,
      costPrice,
      sellPrice,
      description,
      stock: stock ? stock : dto.serialCodes?.length,
      isInstallment,
    });

    if (!product) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }

    // Xử lý serialCodes
    if (dto.serialCodes && dto.serialCodes.length) {
      // Lọc serial mới
      const newSerials = dto.serialCodes.filter((s) => s.action === 'new');

      if (newSerials.length > 0) {
        const serialCodesToCheck = newSerials.map((s) => s.serialCode);
        const existSerials =
          await this.serialService.checkExistSerialCodes(serialCodesToCheck);

        if (existSerials.length > 0) {
          throw new BadRequestException(
            `Các serial sau đã tồn tại: ${existSerials.join(', ')}`,
          );
        }
      }

      // Tạo/cập nhật serial
      for (const s of dto.serialCodes) {
        if (s.action === 'new') {
          await this.serialService.create({
            productId,
            serialCode: s.serialCode,
          });
        } else if (s.action === 'edit' && s.id) {
          await this.serialService.updateById(s.id, {
            serialCode: s.serialCode,
          });
        }
      }
    }

    return product;
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
        stock: number;
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

    const { promos, defaultPromo } =
      await this.promotionRepo.findValidByProductIds(productIds);

    const promotionMap: Record<
      string,
      { discountValue: number; discountType: string; maxDiscountMoney?: number }
    > = {};

    for (const promo of promos) {
      for (const pid of promo.products) {
        promotionMap[pid.toString()] = {
          discountValue: promo.discountValue,
          discountType: promo.discountType,
          maxDiscountMoney: promo.maxDiscountMoney ?? null,
        };
      }
    }

    const result: ProductByCategoryDto[] = [];

    for (const category of categories) {
      const categoryId = (category._id as Types.ObjectId).toString();
      const rawProducts = grouped[categoryId] || [];

      const simplifiedProducts: SimpleProductDto[] = rawProducts.map((p) => {
        const promo =
          promotionMap[p._id.toString()] ||
          (defaultPromo
            ? {
                discountValue: defaultPromo.discountValue,
                discountType: defaultPromo.discountType,
                maxDiscountMoney: defaultPromo.maxDiscountMoney ?? null,
              }
            : null);

        return {
          id: p._id,
          name: p.name,
          sellPrice: p.sellPrice,
          image: imageMap[p._id.toString()] || null,
          isInstallment: p.isInstallment,
          isPromotion: !!promo,
          salePrice: p.salePrice,
          discountValue: promo?.discountValue ?? null,
          discountType: promo?.discountType ?? null,
          maxDiscountMoney: promo?.maxDiscountMoney ?? null,
          isInStock: p.stock > 0, // ✅ thêm flag để UI xử lý
        };
      });

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

    const [category, brand, images, variables, serialCodes, promotion] =
      await Promise.all([
        this.categoryRepo.findById(String(product.categoryId)),
        this.brandRepo.findById(String(product.brandId)),
        this.productImageService.findByProductId(productId),
        this.variableService.findByProductId(productId),
        this.serialService.findByProductId(productId),
        this.promotionRepo.findValidByProductId(productId), // thêm gọi promotion
      ]);

    return plainToInstance(ProductDetailDto, {
      id: (product as any)._id.toString(),
      name: product.name,
      description: product.description,
      sellPrice: product.sellPrice,
      listImage: images.map((img) => img.url),
      variables,
      brands: brand?.name || '',
      categoryName: category?.name || '',
      typeProduct: product.typeProduct,
      isInstallment: product.isInstallment,
      barcode: product.barcode,
      costPrice: product.costPrice,
      stock: product.stock,
      serialCodes,
      discountValue: promotion?.discountValue || 0,
      discountType: promotion?.discountType || null,
      maxDiscountMoney: promotion?.maxDiscountMoney || 0,
      isInStock: product.stock > 0,
    });
  }

  async searchProducts(query: BaseQueryDto) {
    const result = await this.productRepository.search(query);
    if (!result.items.length) {
      return {
        ...result,
        items: [],
      };
    }

    const productIds = result.items.map((p: any) => p._id.toString());

    // Lấy default image
    const productImages =
      await this.productImageService.findDefaultByProductIds(productIds);
    const imageMap: Record<string, string> = {};
    for (const img of productImages) {
      imageMap[img.productId.toString()] = img.url;
    }

    // Lấy promotion
    const { promos, defaultPromo } =
      await this.promotionRepo.findValidByProductIds(productIds);
    const promotionMap: Record<
      string,
      { discountValue: number; discountType: string; maxDiscountMoney?: number }
    > = {};

    for (const promo of promos) {
      for (const pid of promo.products) {
        promotionMap[pid.toString()] = {
          discountValue: promo.discountValue,
          discountType: promo.discountType,
          maxDiscountMoney: promo.maxDiscountMoney ?? null,
        };
      }
    }

    // Gộp lại
    const itemsWithImageAndPromo = result.items.map((product: any) => {
      const promo =
        promotionMap[product._id.toString()] ||
        (defaultPromo
          ? {
              discountValue: defaultPromo.discountValue,
              discountType: defaultPromo.discountType,
              maxDiscountMoney: defaultPromo.maxDiscountMoney ?? null,
            }
          : null);

      return {
        ...(product.toObject?.() || product),
        defaultImage: imageMap[product._id.toString()] || null,
        isPromotion: !!promo,
        discountValue: promo?.discountValue ?? null,
        discountType: promo?.discountType ?? null,
        maxDiscountMoney: promo?.maxDiscountMoney ?? null,
      };
    });

    return {
      ...result,
      items: itemsWithImageAndPromo,
    };
  }

  async getProductsByBrandName(brandName: string, query: FilterProductDto) {
    const brand = await this.brandRepo.findByName(brandName);
    if (!brand) {
      throw new NotFoundException(`Brand ${brandName} not found`);
    }

    const {
      sortBy = 'sellPrice',
      sortOrder = 'asc',
      filters,
      fromPrice,
      toPrice,
    } = query;

    const products = await this.productRepository.findByBrandId(
      String(brand._id),
      sortBy,
      sortOrder,
      fromPrice,
      toPrice,
    );

    const productIds = products.map((p) => (p as any)._id.toString());

    let filteredProductIds = productIds;

    if (filters && filters.length > 0) {
      // Lọc bỏ các filter có value rỗng
      const validFilters = filters.filter((f) => f.value && f.value.length > 0);

      if (validFilters.length > 0) {
        // Chuyển FilterItemDto[] thành {key, value?: string[]}[] đúng kiểu
        const flatFilters: { key: string; value?: string[] }[] =
          validFilters.map((f) => ({
            key: f.key,
            value: f.value, // giữ nguyên là mảng string
          }));

        filteredProductIds = await this.speciRepo.getFilteredProductIds(
          productIds,
          flatFilters,
        );
      }
    }

    const filteredProducts = products.filter((p) =>
      filteredProductIds.includes((p as any)._id.toString()),
    );

    return Promise.all(
      filteredProducts.map(async (product) => {
        const images = await this.productImageService.findByProductId(
          String(product._id),
        );
        const variables = await this.variableService.findByProductId(
          String(product._id),
        );

        return {
          id: product._id,
          name: product.name,
          description: product.description,
          sellPrice: product.sellPrice,
          listImage: images.map((img) => img.url),
          variables,
          brands: brand.name || '',
          categoryId: product.categoryId,
        };
      }),
    );
  }

  async getProductsByCategoryName(
    categoryName: string,
    query: FilterProductDto,
  ) {
    const category = await this.categoryRepo.findByName(categoryName);
    if (!category) {
      throw new NotFoundException(`Danh mục ${categoryName} không tìm thấy`);
    }

    const {
      sortBy = 'sellPrice',
      sortOrder = 'asc',
      filters,
      fromPrice,
      toPrice,
    } = query;

    // Lấy sản phẩm theo category
    const products = await this.productRepository.findByCategoryId(
      String(category._id),
      sortBy,
      sortOrder,
      fromPrice,
      toPrice,
    );

    const productIds = products.map((p) => (p as any)._id.toString());
    let filteredProductIds = productIds;

    if (filters && filters.length > 0) {
      // Lọc bỏ các filter có value rỗng
      const validFilters = filters.filter((f) => f.value && f.value.length > 0);

      if (validFilters.length > 0) {
        const flatFilters: { key: string; value?: string[] }[] =
          validFilters.map((f) => ({
            key: f.key,
            value: f.value, // giữ nguyên là mảng string
          }));

        filteredProductIds = await this.speciRepo.getFilteredProductIds(
          productIds,
          flatFilters,
        );
      }
    }

    const filteredProducts = products.filter((p) =>
      filteredProductIds.includes((p as any)._id.toString()),
    );

    return Promise.all(
      filteredProducts.map(async (product) => {
        const images = await this.productImageService.findByProductId(
          String(product._id),
        );
        const variables = await this.variableService.findByProductId(
          String(product._id),
        );

        return {
          id: product._id,
          name: product.name,
          description: product.description,
          sellPrice: product.sellPrice,
          listImage: images.map((img) => img.url),
          variables,
          categoryId: product.categoryId,
        };
      }),
    );
  }

  async getList(query: BaseQueryDto) {
    return this.productRepository.findWithPagination(query);
  }

  async getRecommendedProducts(productId: string) {
    const products = await this.productRepository.getRecommendedProducts(
      productId,
      10,
    );
    if (!products.length) return [];

    const productIds = products.map((p) => p._id.toString());

    // Ảnh
    const productImages =
      await this.productImageService.findDefaultByProductIds(productIds);
    const imageMap: Record<string, string> = {};
    for (const img of productImages) {
      imageMap[img.productId.toString()] = img.url;
    }

    // Promotion
    const { promos, defaultPromo } =
      await this.promotionRepo.findValidByProductIds(productIds);
    const promotionMap: Record<
      string,
      { discountValue: number; discountType: string; maxDiscountMoney?: number }
    > = {};

    for (const promo of promos) {
      for (const pid of promo.products) {
        promotionMap[pid.toString()] = {
          discountValue: promo.discountValue,
          discountType: promo.discountType,
          maxDiscountMoney: promo.maxDiscountMoney ?? null,
        };
      }
    }

    // Map ra DTO đơn giản
    return products.map((p) => {
      const promo =
        promotionMap[p._id.toString()] ||
        (defaultPromo
          ? {
              discountValue: defaultPromo.discountValue,
              discountType: defaultPromo.discountType,
              maxDiscountMoney: defaultPromo.maxDiscountMoney ?? null,
            }
          : null);

      return {
        id: p._id,
        name: p.name,
        sellPrice: p.sellPrice,
        salePrice: p.salePrice,
        isInStock: p.stock > 0,
        image: imageMap[p._id.toString()] || null,
        isInstallment: p.isInstallment,
        isPromotion: !!promo,
        discountValue: promo?.discountValue ?? null,
        discountType: promo?.discountType ?? null,
        maxDiscountMoney: promo?.maxDiscountMoney ?? null,
      };
    });
  }

  async exportExcelProduct(): Promise<Buffer> {
    const products = await this.productRepository.findAll();
    const productIds = products.map((p) => (p as any)._id.toString());

    const defaultImages =
      await this.productImageService.findDefaultByProductIds(productIds);
    const defaultImageMap = new Map(
      defaultImages.map((img) => [img.productId.toString(), img.url]),
    );

    const otherImages =
      await this.productImageService.findOtherByProductIds(productIds);

    const otherImageMap = new Map<string, string[]>();
    for (const img of otherImages) {
      const pid = img.productId.toString();
      if (!otherImageMap.has(pid)) {
        otherImageMap.set(pid, []);
      }
      const arr = otherImageMap.get(pid)!;
      arr.push(img.url);
    }

    const serialsMap = new Map<string, string[]>();
    const serialProducts = products.filter(
      (p) => Number(p.typeProduct) === 200,
    );
    for (const p of serialProducts) {
      const pid = (p as any)._id.toString();
      const serials = await this.serialRepo.findSerialNotSoldByProductId(pid);
      serialsMap.set(
        pid,
        serials.map((s) => s.serialCode),
      );
    }

    const data = products.map((p) => {
      const pid = (p as any)._id.toString();
      return {
        'Tên sản phẩm': p.name,
        'Giá gốc': p.costPrice,
        'Giá bán': p.sellPrice,
        'Danh mục': (p.categoryId as any)?.name || '',
        'Thương hiệu': (p.brandId as any)?.name || '',
        'Tồn kho': p.stock,
        'Mã sản phẩm': p.barcode,
        'Trả góp': p.isInstallment ? 'Có' : 'Không',
        'Loại sản phẩm':
          Number(p.typeProduct) === 100
            ? 'Sản phẩm thường'
            : Number(p.typeProduct) === 200
              ? 'Sản phẩm có seri'
              : Number(p.typeProduct) === 300
                ? 'Sản phẩm có biến thể'
                : 'Sản phẩm có biến thể seri',
        'Ảnh mặc định': defaultImageMap.get(pid) || '',
        'Ảnh sản phẩm': (otherImageMap.get(pid) || []).join('; '),
        Serial:
          Number(p.typeProduct) === 200
            ? (serialsMap.get(pid) || []).join('; ')
            : '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    worksheet['!cols'] = [
      { wch: 50 }, // Tên sản phẩm
      { wch: 15 }, // Giá gốc
      { wch: 15 }, // Giá bán
      { wch: 20 }, // Danh mục
      { wch: 20 }, // Thương hiệu
      { wch: 10 }, // Tồn kho
      { wch: 20 }, // Mã sản phẩm
      { wch: 20 }, // Trả góp
      { wch: 40 }, // Loại sản phẩm
      { wch: 40 }, // Ảnh mặc định
      { wch: 40 }, // Ảnh sản phẩm
      { wch: 50 }, // Serial
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async exportTemplateExcel(typeProduct: ProductType): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const categories = await this.categoryRepo.getAll();
    const brands = await this.brandRepo.findAll();

    const productSheet = workbook.addWorksheet('Product');

    const productHeaders = [
      'CategoryId',
      'BrandId',
      'Name',
      'Description',
      'CostPrice',
      'SellPrice',
      'Stock',
      'Barcode',
      'MainImage',
      'ListImage',
      'IsInstallment',
      'Specifications',
    ];
    if (typeProduct === ProductType.NORMAL_SERIALS)
      productHeaders.push('Serials');

    const headerRow = productSheet.addRow(productHeaders);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    const sampleRow = productHeaders.map((col) => {
      switch (col) {
        case 'CategoryId':
          return categories.length ? categories[0].name : '';
        case 'BrandId':
          return brands.length ? brands[0].name : '';
        case 'Name':
          return 'Sản phẩm mẫu';
        case 'Description':
          return 'Mô tả sản phẩm mẫu';
        case 'CostPrice':
          return 100000;
        case 'SellPrice':
          return 120000;
        case 'Stock':
          return 10;
        case 'Barcode':
          return 'SP001';
        case 'MainImage':
          return 'https://link-to-main-image.jpg';
        case 'ListImage':
          return 'https://link1.jpg;https://link2.jpg';
        case 'IsInstallment':
          return 'Có'; // dropdown: Có/Không
        case 'Specifications':
          return 'Màu:Đỏ,Kích:L';
        case 'Serials':
          return 'S001;S002;S003';
        default:
          return '';
      }
    });
    productSheet.addRow(sampleRow);

    // --- Dropdown Category ---
    if (categories.length) {
      const categoryNames = categories.map((c) => c.name);
      for (let i = 3; i <= 100; i++) {
        productSheet.getCell(`A${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${categoryNames.join(',')}"`],
          showErrorMessage: true,
          error: 'Chọn Category hợp lệ',
        };
      }
    }

    // --- Dropdown Brand ---
    if (brands.length) {
      const brandNames = brands.map((b) => b.name);
      for (let i = 3; i <= 100; i++) {
        productSheet.getCell(`B${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${brandNames.join(',')}"`],
          showErrorMessage: true,
          error: 'Chọn Brand hợp lệ',
        };
      }
    }

    // --- Dropdown IsInstallment ---
    for (let i = 3; i <= 100; i++) {
      productSheet.getCell(`K${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Có,Không"'],
        showErrorMessage: true,
        error: 'Chọn Có hoặc Không',
      };
    }

    // --- Sheet Variables ---
    if (
      [
        ProductType.NORMAL_VARIABLES,
        ProductType.NORMAL_VARIABLES_SERIALS,
      ].includes(typeProduct)
    ) {
      const variableSheet = workbook.addWorksheet('Variables');
      const variableHeaders = [
        'Attributes',
        'CostPrice',
        'SellPrice',
        'Stock',
        'Description',
        'Image',
      ];
      if (typeProduct === ProductType.NORMAL_VARIABLES_SERIALS)
        variableHeaders.push('Serials');

      const varHeaderRow = variableSheet.addRow(variableHeaders);
      varHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      const sampleVarRow = variableHeaders.map((col) => {
        switch (col) {
          case 'Attributes':
            return 'Màu:Đỏ,Kích:L';
          case 'CostPrice':
            return 95000;
          case 'SellPrice':
            return 115000;
          case 'Stock':
            return 5;
          case 'Description':
            return 'Biến thể mẫu';
          case 'Image':
            return 'https://link-to-variable-image.jpg';
          case 'Serials':
            return 'V001;V002;V003';
          default:
            return '';
        }
      });
      variableSheet.addRow(sampleVarRow);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async importFromExcel(fileBuffer: Buffer, typeProduct: ProductType) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const categories = await this.categoryRepo.getAll();
    const brands = await this.brandRepo.findAll();

    const products: any[] = [];

    const productSheet = workbook.getWorksheet('Product');
    if (!productSheet) throw new Error('Sheet Product không tồn tại');

    // Helper: lấy giá trị cell kiểu string (dù là text/hyperlink/object)
    const getCellString = (cell: any): string => {
      if (!cell) return '';
      if (typeof cell === 'object') {
        if ('hyperlink' in cell) return String(cell.hyperlink);
        if ('text' in cell) return String(cell.text);
        return '';
      }
      return String(cell);
    };

    productSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber < 3) return; // bỏ header + ví dụ

      const values = row.values as Array<any> | undefined;
      if (!values) return;

      const [
        categoryNameRaw,
        brandNameRaw,
        name,
        description,
        costPrice,
        sellPrice,
        stock,
        barcode,
        mainImageCell,
        listImageCell,
        isInstallmentRaw,
        specifications,
        serials,
      ] = values.slice(1);

      const categoryName = getCellString(categoryNameRaw).trim();
      const brandName = getCellString(brandNameRaw).trim();
      const mainImage = getCellString(mainImageCell).trim();
      const listImageStr = getCellString(listImageCell).trim();
      const listImage = listImageStr
        ? listImageStr
            .split(';')
            .map((x) => x.trim())
            .filter((x) => x)
        : [];
      const isInstallment = getCellString(isInstallmentRaw).trim() === 'Có';

      const category = categories.find((c) => c.name === categoryName);
      const brand = brands.find((b) => b.name === brandName);

      // Chuyển specifications dạng "key:value,key:value" thành array object
      const attributes = specifications
        ? specifications.split(',').map((attr) => {
            const [key, value] = attr.split(':').map((x) => x.trim());
            return { key, value };
          })
        : [];

      const product: any = {
        categoryId: category?._id ?? null,
        brandId: brand?._id ?? null,
        name: name ?? '',
        description: description ?? '',
        costPrice: Number(costPrice ?? 0),
        sellPrice: Number(sellPrice ?? 0),
        stock: Number(stock ?? 0),
        barcode: barcode ?? '',
        mainImage,
        listImage,
        isInstallment,
        attributes,
      };

      if (typeProduct === ProductType.NORMAL_SERIALS) {
        product.serials = serials
          ? getCellString(serials)
              .split(';')
              .map((x) => x.trim())
          : [];
      }

      products.push(product);
    });

    // --- Sheet Variables ---
    const variables: any[] = [];
    if (
      [
        ProductType.NORMAL_VARIABLES,
        ProductType.NORMAL_VARIABLES_SERIALS,
      ].includes(typeProduct)
    ) {
      const variableSheet = workbook.getWorksheet('Variables');
      if (variableSheet) {
        variableSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (rowNumber < 3) return;

          const values = row.values as Array<any> | undefined;
          if (!values) return;

          const [
            attributesCell,
            costPrice,
            sellPrice,
            stock,
            description,
            imageCell,
            serials,
          ] = values.slice(1);

          const attributesStr = getCellString(attributesCell).trim();
          const image = getCellString(imageCell).trim();

          const attributes = attributesStr
            ? attributesStr.split(',').map((attr) => {
                const [key, value] = attr.split(':').map((x) => x.trim());
                return { key, value };
              })
            : [];

          const variable: any = {
            attributes,
            costPrice: Number(costPrice ?? 0),
            sellPrice: Number(sellPrice ?? 0),
            stock: Number(stock ?? 0),
            description: description ?? '',
            image,
          };

          if (typeProduct === ProductType.NORMAL_VARIABLES_SERIALS) {
            variable.serials = serials
              ? getCellString(serials)
                  .split(';')
                  .map((x) => x.trim())
              : [];
          }

          variables.push(variable);
        });
      }
    }

    return { products, variables };
  }
}
