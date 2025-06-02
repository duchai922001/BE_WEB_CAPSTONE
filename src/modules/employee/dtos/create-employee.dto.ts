import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEmployeeDto{
    @IsString()
    @IsNotEmpty({message: 'userId is required'})
    userId: string;

    @IsNumber()
    @IsOptional()
    status: number;
}