import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleController } from "./role.controller";
import { Role, RoleSchema } from "./role.entity";
import { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    ],
    providers: [RoleRepository, RoleService],
    controllers: [RoleController],
    exports: [RoleRepository, RoleService],
  })
  export class RoleModule {}