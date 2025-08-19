import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/create.dto';
import { UserDocument } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { isValidObjectId, Types } from 'mongoose';
import { AddressService } from '../address/address.service';
import { changeProfilePassword } from './dtos/change-profile-password';
import { RoleService } from '../roles/role.service';
import { RepairRequestRepository } from '../repairRequest/repairRequest.repository';
import { RepairInvoiceItemRepository } from '../repair-invoice-item/repair-invoice-item.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressService: AddressService,
    private readonly roleService: RoleService,
    private readonly repairRequestRepo: RepairRequestRepository,
    private readonly repairInvoiceItemRepo: RepairInvoiceItemRepository,
  ) {}

  async create(data: CreateUserDto) {
    const { password, phone, email, fullName, roleId } = data;

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Tìm user đã tồn tại theo phone hoặc email
    const existingUser = await this.userRepository.findByPhoneOrEmail(
      phone,
      email,
    );

    if (existingUser) {
      if (existingUser.status === 1) {
        // User active → báo lỗi
        throw new BadRequestException('Email hoặc số điện thoại đã tồn tại');
      } else {
        // User inactive → kích hoạt lại
        return this.userRepository.updateUserActive((existingUser as any)._id, {
          fullName: fullName || existingUser.fullName,
          email: email || existingUser.email,
          phone: phone || existingUser.phone,
          roleId: existingUser.roleId,
          password: hashedPassword || existingUser.password,
          status: 1,
        });
      }
    }

    // Xác định roleId
    let finalRoleId = roleId;
    if (!roleId) {
      const customerRole = await this.roleService.findByName('CUSTOMER');
      if (!customerRole) {
        throw new BadRequestException('Không tìm thấy role CUSTOMER');
      }
      finalRoleId = (customerRole as any)._id;
    }

    // Tạo user mới
    const newUserData: Partial<UserDocument> = {
      fullName,
      phone,
      status: 1,
      roleId: new Types.ObjectId(finalRoleId),
    };

    if (email) newUserData.email = email;
    if (hashedPassword) newUserData.password = hashedPassword;

    const newUser = await this.userRepository.create(newUserData);

    return newUser;
  }

  async createUserUnActive(data: { phone: string; fullName: string }) {
    const roleCustomer = await this.roleService.findByName('CUSTOMER');
    if (!roleCustomer) {
      throw new BadRequestException('Không tìm thấy role CUSTOMER');
    }
    const user = await this.userRepository.create({
      ...data,
      roleId: (roleCustomer as any)._id,
      password: '',
      email: '',
      status: 0,
    });
    return user;
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

    if (user.status === 0) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt');
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

  async getConsultants() {
    return await this.userRepository.findConsultants();
  }

  async getTechnicians() {
    const technicals = await this.userRepository.findTechnicians();
    const results: any[] = [];

    for (const tech of technicals) {
      const repairs = await this.repairRequestRepo.findActiveByTechnician(
        (tech as any)._id.toString(),
      );

      let maxCompletionTime: Date | null = null;
      const repairsWithInvoices: any[] = [];

      for (const repair of repairs) {
        const invoiceItems =
          await this.repairInvoiceItemRepo.findByRepairRequestId(
            (repair as any)._id.toString(),
          );

        // Tính thời gian hoàn thành cho từng repair
        let repairCompletionTime: Date | null = null;

        for (const item of invoiceItems) {
          // estimatedTime: "2h", "3d", "45m"
          let estimatedHours = 0;

          if (
            item.repairServiceId &&
            (item.repairServiceId as any).estimatedTime
          ) {
            const match = (item.repairServiceId as any).estimatedTime.match(
              /(\d+)([dhm])/i,
            );
            if (match) {
              const value = parseInt(match[1], 10);
              const unit = match[2].toLowerCase();
              if (unit === 'd') estimatedHours = value * 24;
              else if (unit === 'h') estimatedHours = value;
              else if (unit === 'm') estimatedHours = value / 60;
            }
          } else {
            estimatedHours = 12;
          }

          const customerConfirmDate = new Date(
            (repair as any).customerConfirmDate,
          );
          const completionTime = new Date(
            customerConfirmDate.getTime() + estimatedHours * 3600000,
          );

          if (!repairCompletionTime || completionTime > repairCompletionTime) {
            repairCompletionTime = completionTime;
          }
        }

        if (
          repairCompletionTime &&
          (!maxCompletionTime || repairCompletionTime > maxCompletionTime)
        ) {
          maxCompletionTime = repairCompletionTime;
        }

        repairsWithInvoices.push({
          ...(repair.toObject?.() ?? repair),
          invoiceItems,
        });
      }

      results.push({
        infoTech: {
          _id: tech._id,
          phone: tech.phone,
          fullName: tech.fullName,
        },
        estimatedCompletionTime: maxCompletionTime ? maxCompletionTime : null,
        ongoingRepairCount: repairs?.length ?? 0,
      });
    }

    return results;
  }

  async findByPhone(phone: string) {
    return await this.userRepository.findByPhone(phone);
  }
}
