import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.entity';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async create(data: any): Promise<User> {
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
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password')
      .exec();
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
