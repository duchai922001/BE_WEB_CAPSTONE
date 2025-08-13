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
import { changeProfilePassword } from './dtos/change-profile-password';
import { RoleService } from '../roles/role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressService: AddressService,
    private readonly roleService: RoleService,
  ) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    const { password, phone, email, roleId } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.userRepository.findByPhoneOrEmail(
      phone,
      email,
    );
    if (existingUser) {
      throw new BadRequestException('Email hoặc số điện thoại đã tồn tại');
    }

    let finalRoleId = roleId;

    if (!roleId) {
      const customerRole = await this.roleService.findByName('CUSTOMER');
      if (!customerRole) {
        throw new BadRequestException('Không tìm thấy role CUSTOMER');
      }
      finalRoleId = (customerRole as any)._id;
    }

    const newUser = await this.userRepository.create({
      ...data,
      roleId: finalRoleId,
      password: hashedPassword,
    });

    return newUser;
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

  async changeForgotPassword(
    id: string,
    payload: { hashedPassword: string },
  ): Promise<any> {
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

  async changeProfilePassword(id: string, data: changeProfilePassword) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    console.log(user.password);
    const isMatch = await bcrypt.compare(data.currentPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không hợp lệ');
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const result = await this.userRepository.updatePassword(id, hashedPassword);
    if (!result) {
      throw new NotFoundException('Không thể update người dùng');
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng với email này');
    }
    return user;
  }
  async getUserByEmailOrPhone(
    email: string,
    phone: string,
  ): Promise<UserDocument | null> {
    const user = await this.userRepository.getUserByEmailOrPhone(email, phone);

    return user;
  }

  async getUsersExcludeAdminAndCustomer() {
    return await this.userRepository.findUsersExcludeRoles([
      'ADMIN',
      'CUSTOMER',
    ]);
  }
  async getCustomers() {
    return await this.userRepository.findUsersExcludeRoles([
      'ADMIN',
      'CONSULTANT',
      'TECHNICIAN',
      'EVENT_STAFF',
    ]);
  }

  async getTechnicians() {
    return this.userRepository.findTechnicians();
  }
}
