import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../users/user.module";
import { Token, TokenSchema } from "./auth.entity";

@Module({
    imports: [
        JwtModule.register({}),
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
        UserModule, // 👈 thêm dòng này để Nest resolve được UserService
      ],
    providers: [AuthService],
    // exports: [UserRepository],
    controllers: [AuthController],
})
export class AuthModule{

}