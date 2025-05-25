import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../users/user.module";
import { Token, TokenSchema } from "./auth.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: '15m' },
        }),
      }),
      MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
      forwardRef(() => UserModule),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard],
    controllers: [AuthController],
  })
  export class AuthModule {}