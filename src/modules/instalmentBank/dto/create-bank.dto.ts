import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBank {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logo: string; // URL ảnh logo

  @IsNumber()
  interestRate: number; // ví dụ 0.012 (1.2%)

  @IsNumber()
  @IsNotEmpty()
  term: number; // số tháng: 6, 9, 12
}
