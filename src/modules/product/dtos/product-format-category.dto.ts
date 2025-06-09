import { Expose } from 'class-transformer';
export class SimpleProductDto {
  @Expose()
  name: string;

  @Expose()
  sellPrice: number;

  @Expose()
  image: string | null;
}

export class ProductByCategoryDto {
  @Expose() categoryName: string;

  @Expose()
  products: any[];
}
