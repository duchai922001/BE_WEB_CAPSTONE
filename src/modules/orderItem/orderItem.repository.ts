import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderItem, OrderItemDocument } from './orderItem.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { CreateOrderItemDto } from './dtos/create-orderItem.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { ProductImageRepository } from '../productImage/productImage.repository';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectModel(OrderItem.name)
    private readonly OrderItemModel: Model<OrderItemDocument>,
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  async create(
    data: CreateOrderItemDto,
    options?: { session?: ClientSession },
  ): Promise<OrderItemDocument> {
    return new this.OrderItemModel(data).save({ session: options?.session });
  }

  async findAll(query: BaseQueryDto): Promise<OrderItemDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.OrderItemModel.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  async findById(id: string): Promise<OrderItemDocument | null> {
    return this.OrderItemModel.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.OrderItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getByOrderId(orderId: string): Promise<any[]> {
    const orderItems = await this.OrderItemModel.find({
      orderId: new Types.ObjectId(orderId),
    })
      .populate({
        path: 'productId',
        select: 'name brand costPrice sellPrice typeProduct',
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No order items found for the given order ID');
    }

    // Lấy ảnh mặc định của từng sản phẩm
    const productImages =
      await this.productImageRepository.findDefaultByProductIds(
        orderItems.map((item) => item.productId._id.toString()),
      );

    // Tạo map ảnh theo productId
    const imageMap = new Map<string, string>();
    productImages.forEach((img) => {
      imageMap.set(img.productId.toString(), img.url);
    });

    const formattedItems = orderItems.map((item) => {
      const { productId, ...rest } = item;
      const imageUrl = imageMap.get(productId._id.toString()) || null;

      return {
        ...rest,
        product: productId,
        imageUrl,
      };
    });

    return formattedItems;
  }
}
