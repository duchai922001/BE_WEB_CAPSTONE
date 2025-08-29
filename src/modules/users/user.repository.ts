import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { UpdateUserDto } from './dtos/update.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: any): Promise<UserDocument> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async find(query: BaseQueryDto): Promise<UserDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.userModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);

    return queryBuilder.exec();
  }

  async count(query: BaseQueryDto) {
    const { filter } = builderQuery(query);
    return this.userModel.countDocuments(filter).exec();
  }
  async findByPhoneOrEmail(
    phone?: string,
    email?: string,
  ): Promise<UserDocument | null> {
    const conditions: FilterQuery<UserDocument>[] = [];
    if (phone) conditions.push({ phone });
    if (email) conditions.push({ email });

    if (conditions.length === 0) return null;

    return this.userModel
      .findOne({
        $or: conditions,
      })
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate('roleId');
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserByEmailOrPhone(
    email: string,
    phone: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({
      $or: [{ email }, { phone }],
    });

    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password')
      .exec();
  }

  async updateUserActive(id: string, data: any): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
  async updatePassword(
    id: string,
    hashedPassword: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
  }
  async updateEmail(id: string, email: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { email: email }, { new: true })
      .select('-password')
      .exec();
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async findUsersExcludeRoles(excludedRoles: string[]) {
    const users = await this.userModel.find().populate('roleId').exec();
    return users.filter((user: any) => {
      const roleName = user.roleId?.name?.toUpperCase?.();
      return !excludedRoles.includes(roleName);
    });
  }

  async findTechnicians() {
    return this.userModel
      .find()
      .populate({
        path: 'roleId',
        match: { name: 'TECHNICIAN' },
      })
      .then((users) => users.filter((user) => user.roleId));
  }

  async findConsultants() {
    return this.userModel
      .find()
      .populate({
        path: 'roleId',
        match: { name: 'CONSULTANT' },
      })
      .then((users) => users.filter((user) => user.roleId));
  }
  async findAdmins() {
    return this.userModel
      .find()
      .populate({
        path: 'roleId',
        match: { name: 'ADMIN' },
      })
      .then((users) => users.filter((user) => user.roleId));
  }
  async findUserByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel
      .findOne({ googleId })
      .populate({
        path: 'roleId',
        populate: { path: 'permissionId' },
      })
      .exec();
  }

  async createGoogleUser(data: {
    googleId: string;
    email: string;
    fullName: string;
    avatar?: string;
    roleId: string;
  }): Promise<User> {
    return this.userModel.create({
      googleId: data.googleId,
      email: data.email,
      fullName: data.fullName,
      avatar: data.avatar || null,
      roleId: new Types.ObjectId(data.roleId),
      status: 1,
    });
  }

  async updateStatus(id: string, status: number): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { status },
      { new: true },
    );
  }
}
