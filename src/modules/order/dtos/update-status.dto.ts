import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;
}
