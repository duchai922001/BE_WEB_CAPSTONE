import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CustomerCreateOrderDto } from "./dtos/customer-create-order.dto";
import { BaseQueryDto } from "src/common/dtos/base-query.dto";
import { UpdateOrderDto } from "./dtos/update-order.dto";

@Injectable()
export class OrderService{
    constructor(private readonly orderRepository: OrderRepository){}

    async customerCreate(data: CustomerCreateOrderDto){
        return await this.orderRepository.create(data);
    }

    async findAll(query: BaseQueryDto){
        return await this.orderRepository.findAll(query);
    }

    async findById(id: string){
        return await this.orderRepository.findById(id);
    }

    async update(id: string, data: UpdateOrderDto){
        return await this.orderRepository.update(id, data);
    }

    async delete(id: string){
        return await this.orderRepository.delete(id);
    }
}