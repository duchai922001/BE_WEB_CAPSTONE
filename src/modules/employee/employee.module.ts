import { MongooseModule } from "@nestjs/mongoose";
import { Employee, EmployeeSchema } from "./employee.entity";
import { EmployeeRepository } from "./employee.repository";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
    ],
    providers: [EmployeeRepository, EmployeeService],
    controllers: [EmployeeController],
    exports: [EmployeeRepository, EmployeeService],
})
export class EmployeeModule{}