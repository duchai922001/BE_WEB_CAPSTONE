import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.entity";
import { VariableModule } from "../variables/variable.module";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports:[
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
        VariableModule,
    ],
    providers: [UserRepository, UserService],
    exports: [UserRepository],
    controllers: [UserController],
})
export class UserModule{}