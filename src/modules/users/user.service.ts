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

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  //Tìm hiểu xong
  async create(data: CreateUserDto): Promise<UserDocument>/* Chỗ này cũng tương tự */ {
    const password = data.password;
    const phone = data.phone;
    const email = data.email;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await this.userRepository.findByPhoneOrEmail(
      phone,
      email,
    );
    if (existingUser) {
      throw new BadRequestException('Account already exists');
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
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }
    await user.populate('roleId')
    return user.toJSON();
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserDocument>{
    if (!isValidObjectId(id)) {
        throw new BadRequestException('ID người dùng không hợp lệ');
      }
    const user = await this.userRepository.findById(id);
    if(!user){
        throw new NotFoundException('Không tìm thấy');
    }

    if(data.email){
        const existingByEmail = await this.userRepository.findByEmail(data.email);
        if(existingByEmail && (existingByEmail._id != user._id)){
            throw new BadRequestException('Email đã được sử dụng bởi người dùng khác');
        }
    }
    const updatedUser = await this.userRepository.update(id, data);
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
}
