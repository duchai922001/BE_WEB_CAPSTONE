import { Injectable } from "@nestjs/common";
import { CreateBank } from "./dto/create-bank.dto";
import { InstalmentBankRepository } from "./instalment-bank.repository";

@Injectable()
export class InstalmentBankService {
  constructor(private readonly bankRepository: InstalmentBankRepository) {}

  create(data: CreateBank) {
    return this.bankRepository.create(data);
  }

  findAll() {
    return this.bankRepository.findAll();
  }

  findById(id: string) {
    return this.bankRepository.findById(id);
  }

  update(id: string, data: Partial<CreateBank>) {
    return this.bankRepository.update(id, data);
  }

  delete(id: string) {
    return this.bankRepository.delete(id);
  }
}