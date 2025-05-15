import { IsNotEmpty, IsString } from "class-validator";

class AttributeDto{
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}

class VariableIputDto{
    
}