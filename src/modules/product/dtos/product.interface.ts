import { ProductType } from 'src/common/enums/productType';

export interface ICreate {
  categoryId: string;
  brandId: string;
  name: string;
  description?: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  barcode: string;
  typeProduct: ProductType;
  isInstallment: boolean;
}
