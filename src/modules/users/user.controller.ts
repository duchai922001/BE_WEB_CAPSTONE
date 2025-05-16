import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create.dto";
import { createResponse } from "src/common/helpers/response.helper";

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService){}
    @Post('')
    async create(@Body() dto: CreateUserDto){
        const data = await this.userService.create(dto);
        return createResponse(HttpStatus.CREATED, data, 'Tạo user thành công')
    }
    // @Get()
    // async 
    
}