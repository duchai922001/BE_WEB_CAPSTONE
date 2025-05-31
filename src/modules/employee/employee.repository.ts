import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Employee, EmployeeDocument } from "./employee.entity";
import { Model } from "mongoose";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";

@Injectable()
export class EmployeeRepository{
    constructor(
        @InjectModel(Employee.name)
        private readonly employeeModel: Model<EmployeeDocument>,
    ){}

    async create(data: CreateEmployeeDto): Promise<EmployeeDocument>{
        const newEmployee = new this.employeeModel(data);
        return newEmployee.save();
    }

    async findAll(): Promise<EmployeeDocument[]>{
        return this.employeeModel.find().exec();
    }

    async findById(id: string): Promise<EmployeeDocument | null>{
        return this.employeeModel.findById(id);
    }

    async delete(id: string): Promise<boolean>{
        const result = await this.employeeModel.deleteOne({_id: id});
        return result.deletedCount > 0;
    }
}