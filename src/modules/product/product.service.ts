import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto, CreateVariableDto } from './dtos/create.dto';
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

    const toNum = (v: unknown, fb = 0): number =>
      typeof v === 'number' && Number.isFinite(v) ? v : fb;

    const productExitedByBarcode =
      await this.productRepository.findProductByBarcode(barcode);
    if (productExitedByBarcode) {
      throw new BadRequestException('Barcode đã tồn tại');
    }
    const productExited = await this.productRepository.findProductByName(name);
    if (productExited) {
      throw new BadRequestException(ResponseMessage.FILE_EXITED_NAME);
    }

    const vars = variables ?? [];

    switch (typeProduct) {
      // ===== 1) Không biến thể, không serial =====
      case ProductType.NO_VARIABLE_NO_SERIAL: {
        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          costPrice: toNum(costPrice, 0),
          name,
          sellPrice: toNum(sellPrice, 0),
          stock: toNum(stock, 0),
          typeProduct,
          description,
          isInstallment,
          productWarrantyPolicyId, // nếu repo cho phép optional thì ok
        });

        await this.handleImages(
          (product as any)._id.toString(),
          mainImage,
          listImage,
        );

        if (specifications?.length) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }
        break;
      }

      // ===== 2) Không biến thể, có serial cấp product =====
      case ProductType.NORMAL_SERIALS: {
        if (!serials || serials.length === 0) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} serials`,
          );
        }

        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          costPrice: toNum(costPrice, 0),
          name,
          sellPrice: toNum(sellPrice, 0),
          stock: serials.length, // số serial = stock
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

        if (specifications?.length) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }

        await Promise.all(
          serials.map((serial) =>
            this.serialService.create({
              productId: (product._id as any).toString(),
              serialCode: serial,
              description: '',
            }),
          ),
        );
        break;
      }

      // ===== 3) Có biến thể, không serial cấp biến thể =====
      case ProductType.NORMAL_VARIABLES: {
        if (!vars.length) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} variables`,
          );
        }

        const first = vars[0];
        const totalStock = vars.reduce((sum, v) => sum + toNum(v.stock, 0), 0);

        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          // Ưu tiên giá ở DTO nếu có, fallback biến thể đầu, cuối cùng 0
          costPrice: toNum(costPrice, toNum(first.costPrice, 0)),
          name,
          sellPrice: toNum(sellPrice, toNum(first.sellPrice, 0)),
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

        if (specifications?.length) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }

        await Promise.all(
          vars.map((item) =>
            this.variableService.create({
              attributes: item.attributes,
              costPrice: toNum(item.costPrice, 0),
              sellPrice: toNum(item.sellPrice, 0),
              image: item.image,
              productId: (product as any)._id.toString(),
              description: item.description,
              serials: [], // không có serial cấp biến thể ở type này
              stock: toNum(item.stock, 0),
            }),
          ),
        );
        break;
      }

      // ===== 4) Có biến thể + có serial cấp biến thể =====
      case ProductType.NORMAL_VARIABLES_SERIALS: {
        if (!vars.length) {
          throw new BadRequestException(
            `${ResponseMessage.REQUIRED_FIELD} variables`,
          );
        }
        // serials ở cấp product KHÔNG dùng cho type này -> không cần check dto.serials
        const first = vars[0];
        const totalStock = vars.reduce(
          (sum, item) => sum + (item.serials?.length || 0),
          0,
        );

        const product = await this.productRepository.create({
          barcode,
          brandId,
          categoryId,
          costPrice: toNum(costPrice, toNum(first.costPrice, 0)),
          name,
          sellPrice: toNum(sellPrice, toNum(first.sellPrice, 0)),
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

        if (specifications?.length) {
          const specsWithProductId = specifications.map((spec) => ({
            ...spec,
            productId: (product as any)._id.toString(),
          }));
          await this.speciSer.createBulk(specsWithProductId);
        }

        await Promise.all(
          vars.map((item) =>
            this.variableService.create({
              attributes: item.attributes,
              costPrice: toNum(item.costPrice, 0),
              sellPrice: toNum(item.sellPrice, 0),
              image: item.image,
              productId: (product as any)._id.toString(),
              description: item.description,
              serials: item.serials ?? [],
              stock: item.serials?.length ?? 0, // stock = số serial của biến thể
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
    const products = await this.productRepository.getAll();

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

  async toggleStatus(productId: string) {
    return await this.productRepository.toggleStatus(productId);
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

    // ====== LOOKUPS (ẩn) ======
    const lookups = workbook.addWorksheet('Lookups', { state: 'veryHidden' });
    lookups.getCell('A1').value = 'Categories';
    lookups.getCell('B1').value = 'Brands';
    lookups.getCell('C1').value = 'YesNo';

    categories.forEach((c, i) => (lookups.getCell(`A${i + 2}`).value = c.name));
    brands.forEach((b, i) => (lookups.getCell(`B${i + 2}`).value = b.name));
    lookups.getCell('C2').value = 'Có';
    lookups.getCell('C3').value = 'Không';

    const catRange = `=Lookups!$A$2:$A$${categories.length + 1 || 2}`;
    const brandRange = `=Lookups!$B$2:$B$${brands.length + 1 || 2}`;
    const yesNoRange = `=Lookups!$C$2:$C$3`;

    // ====== PRODUCT ======
    const productSheet = workbook.addWorksheet('Product');

    // Thêm ProductKey để liên kết với biến thể
    const productHeaders = [
      'ProductKey', // << NEW: dùng để link tới Variables
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

    // Hàng mẫu
    const sampleRow = productHeaders.map((col) => {
      switch (col) {
        case 'ProductKey':
          return 'SP001'; // khóa duy nhất
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
          return 'BARCODE001';
        case 'MainImage':
          return 'https://link-to-main-image.jpg';
        case 'ListImage':
          return 'https://link1.jpg;https://link2.jpg';
        case 'IsInstallment':
          return 'Có';
        case 'Specifications':
          return 'Màu:Đỏ,Kích:L';
        case 'Serials':
          return 'S001;S002;S003';
        default:
          return '';
      }
    });
    productSheet.addRow(sampleRow);

    // Auto width đơn giản
    productSheet.columns = productHeaders.map(() => ({ width: 18 }));

    // Helper lấy index cột theo tên
    const colIdx = (name: string) => productHeaders.indexOf(name) + 1;

    // Data validation cho các cột (1000 dòng nhập)
    const MAX_ROWS = 1000;
    for (let r = 3; r <= MAX_ROWS; r++) {
      // Category
      productSheet.getCell(r, colIdx('CategoryId')).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [catRange],
        showErrorMessage: true,
        error: 'Chọn Category hợp lệ',
      };
      // Brand
      productSheet.getCell(r, colIdx('BrandId')).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [brandRange],
        showErrorMessage: true,
        error: 'Chọn Brand hợp lệ',
      };
      // IsInstallment
      productSheet.getCell(r, colIdx('IsInstallment')).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [yesNoRange],
        showErrorMessage: true,
        error: 'Chọn Có hoặc Không',
      };
    }

    // ====== VARIABLES (khi type là biến thể) ======
    const isVariables = [
      ProductType.NORMAL_VARIABLES,
      ProductType.NORMAL_VARIABLES_SERIALS,
    ].includes(typeProduct);

    if (isVariables) {
      const variableSheet = workbook.addWorksheet('Variables');
      const variableHeaders = [
        'ProductKey', // << liên kết về Product.ProductKey
        'Attributes', // ví dụ: "Màu:Đỏ,Kích:L"
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

      // Hàng mẫu
      const sampleVarRow = variableHeaders.map((col) => {
        switch (col) {
          case 'ProductKey':
            return 'SP001'; // trỏ tới SP001 ở sheet Product
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

      variableSheet.columns = variableHeaders.map(() => ({ width: 18 }));

      // Dropdown ProductKey ở Variables dựa trên cột A (ProductKey) của sheet Product
      // Vì ProductKey là cột 1 (A) nên reference A3..A1000
      const productKeyRange = `=Product!$A$3:$A$${MAX_ROWS}`;
      const vColIdx = (name: string) => variableHeaders.indexOf(name) + 1;
      for (let r = 3; r <= MAX_ROWS; r++) {
        variableSheet.getCell(r, vColIdx('ProductKey')).dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: [productKeyRange],
          showErrorMessage: true,
          error: 'Chọn ProductKey có trong sheet Product',
        };
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private getCellStr(v: ExcelJS.CellValue | undefined | null): string {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'number') return String(v);
    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
    if (v instanceof Date) return v.toISOString();
    if (typeof v === 'object') {
      const anyV: any = v as any;
      if ('text' in anyV && typeof anyV.text === 'string') return anyV.text;
      if ('hyperlink' in anyV && typeof anyV.hyperlink === 'string')
        return anyV.hyperlink;
    }
    return '';
  }

  private splitList(s: string): string[] {
    return s
      ? s
          .split(';')
          .map((x) => x.trim())
          .filter(Boolean)
      : [];
  }

  private parseKeyValueList(s: string): { key: string; value: string }[] {
    return s
      ? s
          .split(',')
          .map((pair) => {
            const [k, ...rest] = pair.split(':');
            return { key: (k || '').trim(), value: rest.join(':').trim() };
          })
          .filter((x) => x.key && x.value)
      : [];
  }

  private headerIndex(sheet: ExcelJS.Worksheet) {
    const row1 = sheet.getRow(1);
    const map = new Map<string, number>();
    row1.eachCell((cell, col) => {
      const key = this.getCellStr(cell.value).trim();
      if (key) map.set(key, col);
    });
    return (name: string) => map.get(name) ?? -1;
  }

  async importFromExcel(
    fileBuffer: Buffer,
    typeProduct: ProductType,
  ): Promise<CreateProductDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const categories = await this.categoryRepo.getAll();
    const brands = await this.brandRepo.findAll();
    const catByName = new Map<string, string>(
      categories.map((c: any) => [String(c.name).trim(), String(c._id)]),
    );
    const brandByName = new Map<string, string>(
      brands.map((b: any) => [String(b.name).trim(), String(b._id)]),
    );

    const needVariables = [
      ProductType.NORMAL_VARIABLES,
      ProductType.NORMAL_VARIABLES_SERIALS,
    ].includes(typeProduct);

    // ===== Đọc sheet Variables trước (gom theo ProductKey) =====
    const variablesByProductKey = new Map<string, CreateVariableDto[]>();
    if (needVariables) {
      const variableSheet = workbook.getWorksheet('Variables');
      if (variableSheet) {
        const vColOf = this.headerIndex(variableSheet);
        const cProdKey = vColOf('ProductKey');
        const cAttrs = vColOf('Attributes');
        const cCost = vColOf('CostPrice');
        const cSell = vColOf('SellPrice');
        const cStock = vColOf('Stock');
        const cDesc = vColOf('Description');
        const cImg = vColOf('Image');
        const cSer = vColOf('Serials'); // có thể -1

        variableSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber < 3) return;

          const productKey = this.getCellStr(
            row.getCell(cProdKey).value,
          ).trim();
          if (!productKey) return;

          const attributes = this.parseKeyValueList(
            this.getCellStr(row.getCell(cAttrs).value).trim(),
          );
          const costPrice = Number(row.getCell(cCost).value ?? 0) || 0;
          const sellPrice = Number(row.getCell(cSell).value ?? 0) || 0;
          const stock = Number(row.getCell(cStock).value ?? 0) || 0;
          const description = this.getCellStr(row.getCell(cDesc).value).trim();
          const image = this.getCellStr(row.getCell(cImg).value).trim();

          const variable: CreateVariableDto = {
            attributes,
            costPrice,
            sellPrice,
            stock,
            description,
            image,
          };

          if (
            typeProduct === ProductType.NORMAL_VARIABLES_SERIALS &&
            cSer !== -1
          ) {
            const serialStr = this.getCellStr(row.getCell(cSer).value).trim();
            if (serialStr) variable.serials = this.splitList(serialStr);
          }

          const list = variablesByProductKey.get(productKey) ?? [];
          list.push(variable);
          variablesByProductKey.set(productKey, list);
        });
      }
    }

    // ===== Đọc sheet Product =====
    const productSheet = workbook.getWorksheet('Product');
    if (!productSheet) throw new Error('Sheet Product không tồn tại');

    const pColOf = this.headerIndex(productSheet);
    const cPKey = pColOf('ProductKey');
    const cCat = pColOf('CategoryId');
    const cBrand = pColOf('BrandId');
    const cName = pColOf('Name');
    const cDesc = pColOf('Description');
    const cCost = pColOf('CostPrice');
    const cSell = pColOf('SellPrice');
    const cStock = pColOf('Stock');
    const cBarcode = pColOf('Barcode');
    const cMain = pColOf('MainImage');
    const cList = pColOf('ListImage');
    const cIns = pColOf('IsInstallment');
    const cSpecs = pColOf('Specifications');
    const cSerProd = pColOf('Serials');

    const products: CreateProductDto[] = [];
    const totalRows = productSheet.rowCount;

    for (let r = 3; r <= totalRows; r++) {
      const row = productSheet.getRow(r);

      const name = this.getCellStr(row.getCell(cName).value).trim();
      const barcode = this.getCellStr(row.getCell(cBarcode).value).trim();
      if (!name && !barcode) continue;

      const productKey =
        cPKey !== -1 ? this.getCellStr(row.getCell(cPKey).value).trim() : '';

      const catName = this.getCellStr(row.getCell(cCat).value).trim();
      const brandName = this.getCellStr(row.getCell(cBrand).value).trim();
      const categoryId = catByName.get(catName);
      const brandId = brandByName.get(brandName);

      if (!categoryId)
        throw new Error(`Dòng ${r}: Không tìm thấy Category "${catName}"`);
      if (!brandId)
        throw new Error(`Dòng ${r}: Không tìm thấy Brand "${brandName}"`);
      if (!barcode) throw new Error(`Dòng ${r}: Thiếu Barcode`);
      if (needVariables && !productKey) {
        throw new Error(`Dòng ${r}: Thiếu ProductKey để liên kết biến thể`);
      }

      const description = this.getCellStr(row.getCell(cDesc).value).trim();
      const costPriceCell = Number(row.getCell(cCost).value ?? 0);
      const sellPriceCell = Number(row.getCell(cSell).value ?? 0);
      const stockCell = Number(row.getCell(cStock).value ?? 0);
      const mainImage = this.getCellStr(row.getCell(cMain).value).trim();
      const listImage = this.splitList(
        this.getCellStr(row.getCell(cList).value).trim(),
      );
      const isInstallment =
        this.getCellStr(row.getCell(cIns).value).trim() === 'Có';
      const specifications = this.parseKeyValueList(
        this.getCellStr(row.getCell(cSpecs).value).trim(),
      );

      // Luôn là mảng (để tránh TS18048)
      const vars: CreateVariableDto[] = needVariables
        ? (variablesByProductKey.get(productKey) ?? [])
        : [];

      // Tổng stock biến thể
      const totalVarStock = vars.reduce(
        (sum, v) => sum + (Number(v.stock ?? 0) || 0),
        0,
      );

      // ===== Branch theo typeProduct =====
      let costPrice: number;
      let sellPrice: number;
      let stock: number;
      let serials: string[] | undefined;
      let variablesOut: CreateVariableDto[] = [];

      switch (typeProduct) {
        case ProductType.NORMAL_VARIABLES:
        case ProductType.NORMAL_VARIABLES_SERIALS: {
          variablesOut = vars; // biến thể đi cùng sản phẩm
          costPrice =
            Number.isFinite(costPriceCell) && costPriceCell !== 0
              ? costPriceCell
              : (vars[0]?.costPrice ?? 0);
          sellPrice =
            Number.isFinite(sellPriceCell) && sellPriceCell !== 0
              ? sellPriceCell
              : (vars[0]?.sellPrice ?? 0);
          stock = totalVarStock; // stock tổng từ biến thể
          // serials cấp sản phẩm: không dùng
          break;
        }

        case ProductType.NORMAL_SERIALS: {
          variablesOut = []; // không có biến thể
          costPrice = Number.isFinite(costPriceCell) ? costPriceCell : 0;
          sellPrice = Number.isFinite(sellPriceCell) ? sellPriceCell : 0;
          stock = Number.isFinite(stockCell) ? stockCell : 0;
          if (cSerProd !== -1) {
            const serStr = this.getCellStr(row.getCell(cSerProd).value).trim();
            serials = serStr ? this.splitList(serStr) : undefined;
          }
          break;
        }

        default: {
          // NORMAL (không serial, không biến thể)
          variablesOut = [];
          costPrice = Number.isFinite(costPriceCell) ? costPriceCell : 0;
          sellPrice = Number.isFinite(sellPriceCell) ? sellPriceCell : 0;
          stock = Number.isFinite(stockCell) ? stockCell : 0;
          break;
        }
      }

      const dto: CreateProductDto = {
        categoryId,
        brandId,
        // ĐỪNG set productWarrantyPolicyId nếu không có (tránh gán undefined cho string)
        variables: variablesOut, // luôn là mảng
        name,
        description,
        costPrice, // luôn number
        sellPrice, // luôn number
        stock, // luôn number
        barcode,
        serials, // undefined khi không dùng
        typeProduct,
        mainImage,
        isInstallment,
        listImage,
        specifications,
      };

      products.push(dto);
    }

    return products;
  }
}
