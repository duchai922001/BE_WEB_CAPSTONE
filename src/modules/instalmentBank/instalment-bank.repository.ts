import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateBank } from "./dto/create-bank.dto";
import { InstalmentBank, InstalmentBankDocument } from "./instalment-bank.entity";

@Injectable()
export class InstalmentBankRepository {
  constructor(
    @InjectModel(InstalmentBank.name)
    private readonly bankModel: Model<InstalmentBankDocument>,
  ) {}

  async create(data: CreateBank): Promise<InstalmentBank> {
    const bank = new this.bankModel(data);
    return bank.save();
  }

  async findAll(): Promise<InstalmentBank[]> {
    return this.bankModel.find().exec();
  }

  async findById(id: string): Promise<InstalmentBank> {
    const bank = await this.bankModel.findById(id).exec();
    if (!bank) {
      throw new NotFoundException(`Bank with ID ${id} not found`);
    }
    return bank;
  }

  async update(id: string, data: Partial<CreateBank>): Promise<InstalmentBank> {
    const bank = await this.bankModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!bank) {
      throw new NotFoundException(`Bank with ID ${id} not found`);
    }
    return bank;
  }

  async delete(id: string): Promise<void> {
    const result = await this.bankModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bank with ID ${id} not found`);
    }
  }
}