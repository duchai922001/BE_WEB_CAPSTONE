import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "./permission.entity";
import { PermissionRepository } from "./permission.repository";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
    ],
    providers: [PermissionRepository, PermissionService],
    controllers: [PermissionController],
    exports: [PermissionRepository, PermissionService],
  })
  export class PermissionModule {}