import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { EmployeeRepository } from "./employee.repository";

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(dto: CreateEmployeeDto) {
    return this.employeeRepository.create(dto);
  }

  async findAll(){
    return this.employeeRepository.findAll();
  }

  async findById(id: string){
    const cart = await this.employeeRepository.findById(id);
    if(!cart) throw new NotFoundException('Không tìm thấy employee');
    return cart;
  }

  async delete(id: string){
    const ok = await this.employeeRepository.delete(id);
    if(!ok) throw new NotFoundException('Không thể xoá employee');
  }
}