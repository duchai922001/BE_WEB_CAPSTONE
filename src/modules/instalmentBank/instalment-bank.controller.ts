import { Controller, Post, Body, Get, Param, Put, Delete } from "@nestjs/common";
import { CreateBank } from "./dto/create-bank.dto";
import { InstalmentBankService } from "./instalment-bank.service";

@Controller('instalment-banks')
export class InstalmentBankController {
  constructor(private readonly bankService: InstalmentBankService) {}

  @Post()
  create(@Body() body: CreateBank) {
    return this.bankService.create(body);
  }

  @Get()
  findAll() {
    return this.bankService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bankService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateBank>) {
    return this.bankService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bankService.delete(id);
  }
}