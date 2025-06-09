import { Expose } from 'class-transformer';

export class ProductDetailDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  sellPrice: number;

  @Expose()
  listImage: string[];

  @Expose()
  variables: any[];

  @Expose()
  brands: string;

  @Expose()
  categoryName: string;
}
