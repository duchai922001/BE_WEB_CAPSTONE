import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create.dto';
import { User, UserDocument } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { isValidObjectId, Types } from 'mongoose';
import { AddressService } from '../address/address.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressService: AddressService,
  ) {}

  //Tìm hiểu xong
  async create(
    data: CreateUserDto,
  ): Promise<UserDocument> /* Chỗ này cũng tương tự */ {
    const password = data.password;
    const phone = data.phone;
    const email = data.email;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await this.userRepository.findByPhoneOrEmail(
      phone,
      email,
    );
    if (existingUser) {
      throw new BadRequestException('Tài khoản đã tồn tại');
    }
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return newUser; // Đang trả ra một UserDocument
  }

  // Done chưa xét page và keyword
  async getAll(query: BaseQueryDto) {
    const users = await this.userRepository.find(query);
    const total = await this.userRepository.count(query);
    return {
      users,
      total,
    };
  }

  async getById(id: string): Promise<UserDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  //Hàm này không thể trả ra một UserDocument tại vì ràng buộc 1: không có password, 2: cần có _id
  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new BadRequestException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const populatedUser = await user.populate({
      path: 'roleId',
      populate: {
        path: 'permissionId',
        select: 'name',
      },
    });
    return populatedUser.toJSON();
  }

  async updateUserBasicInformation(
    id: string,
    data: UpdateUserDto,
  ): Promise<UserDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy');
    }
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      throw new NotFoundException('Không thể cập nhật người dùng');
    }
    return updatedUser;
  }

  async updateEmail(id: string, email: string): Promise<UserDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy');
    }
    const updatedUser = await this.userRepository.updateEmail(id, email);
        if (!updatedUser) {
      throw new NotFoundException('Không thể cập nhật người dùng');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const result = await this.userRepository.delete(id);
    if (!result) {
      throw new NotFoundException('Không thể xóa người dùng');
    }
  }

  async changePassword(id: string, payload: {hashedPassword: string}): Promise<any> {
      const { hashedPassword } = payload;
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const result = await this.userRepository.updatePassword(id, hashedPassword);
    if (!result) {
      throw new NotFoundException('Không thể update người dùng');
    }
    return {
      message: 'Đổi mật khẩu thành công',
      userId: result._id,
    };
  }
  async getUserByEmail(email: string): Promise<UserDocument> {
  const user = await this.userRepository.findByEmail(email);
  if (!user) {
    throw new NotFoundException('Không tìm thấy người dùng với email này');
  }
  return user;
}
}
