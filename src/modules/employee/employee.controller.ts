import { Controller, Post, Body, HttpStatus, Get, Param, Delete } from "@nestjs/common";
import { createResponse } from "src/common/helpers/response.helper";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { EmployeeService } from "./employee.service";

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    const data = await this.employeeService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo employee thành công');
  }
  @Get()
  async findAll() {
    const data = await this.employeeService.findAll();
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách employee thành công');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.employeeService.findById(id);
    return createResponse(HttpStatus.OK, data, ' Lấy employee thành công');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.employeeService.delete(id);
    return createResponse(HttpStatus.OK, null, 'Xoá employee thành công');
  }
}