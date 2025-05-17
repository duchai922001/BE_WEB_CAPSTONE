import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<User> {
    const { phone, password, fullName, email, avatar, status } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await this.userRepository.findByPhoneOrEmail(
      phone,
      email,
    );
    if (existingUser) {
      throw new BadRequestException('Account already exists');
    }
    const newUser = await this.userRepository.create({
      phone,
      password: hashedPassword,
      fullName,
      email,
      avatar,
      status,
    });
    return newUser;
  }

  async getAll(query: BaseQueryDto) {
    const users = await this.userRepository.find(query);
    const total = await this.userRepository.count(query);
    return {
      users,
      total,
    };
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }
  async validateUser(phone: string, password: string): Promise<User> {
    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
