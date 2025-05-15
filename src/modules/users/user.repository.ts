import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BaseQueryDto } from "src/common/dtos/base-query.dto";
import { builderQuery } from "src/common/helpers/query-builder.helper";

@Injectable()
export class UserRepository{
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}
    async create(data: any): Promise<User>{
        const newUser = new this.userModel(data);
        return newUser.save();
    }
async find(query: BaseQueryDto): Promise<UserDocument[]>{
    const {filter, pagination, sort} = builderQuery(query);
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

}