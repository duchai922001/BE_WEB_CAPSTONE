import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types, Connection } from 'mongoose';
import {
  RepairWarrantyHistory,
  RepairWarrantyHistoryDocument,
} from './repair-warranty-history.entity';
import {
  CreateRepairWarrantyHistoryDto,
  GetWarrantyHistoryQueryDto,
  QueryRepairWarrantyHistoryDto,
  UpdatePhotosDto,
  UpdateRepairWarrantyHistoryDto,
  UpdateStatusDto,
} from './repair-warranty-history.dto';
import { RepairWarrantyHistoryStatus } from 'src/common/enums/repair-warranty-history';
import {
  RepairRequest,
  RepairRequestDocument,
} from '../repairRequest/repairRequest.entity';
import * as nodemailer from 'nodemailer';
import * as dayjs from 'dayjs';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationType } from 'src/common/enums/notification-type';
@Injectable()
export class RepairWarrantyHistoryService {
  constructor(
    @InjectModel(RepairWarrantyHistory.name)
    private readonly model: Model<RepairWarrantyHistoryDocument>,
    @InjectModel(RepairRequest.name)
    private readonly requestModel: Model<RepairRequestDocument>,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(staffId: string, dto: CreateRepairWarrantyHistoryDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const reqId = new Types.ObjectId(dto.repairRequestId);

      const updatedReq = await this.requestModel.findByIdAndUpdate(
        reqId,
        { $inc: { countWarranty: 1 } },
        { new: true, session, projection: { countWarranty: 1 } },
      );
      if (!updatedReq) {
        throw new Error('RepairRequest not found');
      }

      const nextCount = updatedReq.countWarranty ?? 1;

      const payload = {
        ...dto,
        repairRequestId: dto.repairRequestId,
        assignedStaffId: staffId,

        countWarranty: nextCount,
      };

      const [doc] = await this.model.create([payload], { session });
      const notif = await this.notificationService.create({
        userId: String(dto.technicianId),
        title: 'Đơn bảo hành vừa được nhân viên tư vấn giao cho bạn',
        message: `Đơn bảo hành vừa được nhân viên tư vấn giao cho bạn`,
        type: NotificationType.ORDER,
        targetUrl: `/permission/manage-warranty-history`,
      });
      this.notificationGateway.sendNotification(
        String(dto.technicianId),
        notif,
      );

      await session.commitTransaction();
      return doc;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Warranty history not found');
    return doc;
  }

  async findAll(query: QueryRepairWarrantyHistoryDto) {
    const { page = 1, limit = 20, repairRequestId, status, from, to } = query;
    const filter: FilterQuery<RepairWarrantyHistoryDocument> = {};

    if (repairRequestId)
      filter.repairRequestId = new Types.ObjectId(repairRequestId);
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findByRepairRequest(repairRequestId: string, page = 1, limit = 20) {
    return this.findAll({ repairRequestId, page, limit });
  }

  async update(id: string, dto: UpdateRepairWarrantyHistoryDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Warranty history not found');
    return updated;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const updated = await this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            status: dto.status,
            diagnosis: dto.diagnosis,
            photosAfter: dto.photosAfter,
          },
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Warranty history not found');
    if (dto.status === RepairWarrantyHistoryStatus.NOTIFY_CUSTOMER) {
      const repairRequest = await this.requestModel
        .findById(updated.repairRequestId)
        .populate('userId');
      const emailUser = (repairRequest?.userId as any).email;
      const fullNameUser = (repairRequest?.userId as any).fullName;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const fromDate = dayjs().add(1, 'day');
      const mailOptions = {
        from: `"Thông báo nhận hàng" <${process.env.EMAIL_USER}>`,
        to: emailUser,
        subject: 'Thông báo lịch hẹn nhận hàng',
        html: `
          <h3>Xin chào ${fullNameUser || ''}</h3>
          <p>Đơn bảo hành của bạn đã sẵn sàng để nhận.</p>
         <p><b>Ngày hẹn nhận:</b> 
    ${fromDate.format('DD-MM-YYYY HH:mm')} 

  </p>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
      };
      await transporter.sendMail(mailOptions);
    }
    return updated;
  }

  async updatePhotos(id: string, dto: UpdatePhotosDto) {
    const inc: any = {};
    if (dto.photosBefore?.length)
      inc.photosBefore = { $each: dto.photosBefore };
    if (dto.photosAfter?.length) inc.photosAfter = { $each: dto.photosAfter };

    const update =
      dto.photosBefore || dto.photosAfter
        ? {
            ...(dto.photosBefore ? { photosBefore: dto.photosBefore } : {}),
            ...(dto.photosAfter ? { photosAfter: dto.photosAfter } : {}),
          }
        : {};

    const updated = await this.model
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Warranty history not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Warranty history not found');
    return { success: true };
  }

  async getSummaryByRepairRequestId(repairRequestId: string) {
    const pendingStatuses = new Set([
      RepairWarrantyHistoryStatus.RECEIVED,
      RepairWarrantyHistoryStatus.CHECKING,
      RepairWarrantyHistoryStatus.IN_PROGRESS,
      RepairWarrantyHistoryStatus.DONE_REPAIR,
      RepairWarrantyHistoryStatus.NOTIFY_CUSTOMER,
    ]);

    const data = await this.model
      .find({ repairRequestId: repairRequestId })
      .populate('assignedStaffId')
      .populate('technicianId')
      .sort({ createdAt: 1, _id: 1 })
      .lean()
      .exec();

    const latest = await this.model
      .findOne({ repairRequestId: repairRequestId })
      .sort({ createdAt: -1, _id: -1 })
      .select({ status: 1 })
      .lean()
      .exec();

    const isPending = latest ? pendingStatuses.has(latest.status) : false;

    return { data, isPending };
  }

  async getByStaff(staffId: string) {
    if (!staffId) {
      throw new BadRequestException('Vui lòng truyền staffId');
    }

    return this.model
      .find({
        $or: [{ assignedStaffId: staffId }, { technicianId: staffId }],
      })
      .populate('assignedStaffId technicianId')
      .populate({
        path: 'repairRequestId',
        select: 'repairRequestCode',
      })
      .populate('repairInvoiceItemId')
      .lean()
      .exec();
  }

  async findByUser(userId: string, q: GetWarrantyHistoryQueryDto) {
    const { status, from, to, page = 1, limit = 20 } = q;

    const matchHistory: any = {};
    if (status) matchHistory.status = status;
    if (from || to) {
      matchHistory.createdAt = {};
      if (from) matchHistory.createdAt.$gte = new Date(from);
      if (to) matchHistory.createdAt.$lte = new Date(to);
    }

    const pipeline: any[] = [
      { $match: matchHistory },

      {
        $lookup: {
          from: 'repairrequests',
          let: { rrid: '$repairRequestId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [{ $toString: '$_id' }, { $toString: '$$rrid' }] },
                    { $eq: [{ $toString: '$userId' }, String(userId)] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                repairRequestCode: 1,
                deviceName: 1,
                deviceSerial: 1,
                status: 1,
              },
            },
          ],
          as: 'repairRequest',
        },
      },
      { $unwind: '$repairRequest' },

      {
        $lookup: {
          from: 'users',
          localField: 'assignedStaffId',
          foreignField: '_id',
          pipeline: [{ $project: { fullName: 1, phone: 1, avatar: 1 } }],
          as: 'assignedStaff',
        },
      },
      { $unwind: { path: '$assignedStaff', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'users',
          localField: 'technicianId',
          foreignField: '_id',
          pipeline: [{ $project: { fullName: 1, phone: 1, avatar: 1 } }],
          as: 'technician',
        },
      },
      { $unwind: { path: '$technician', preserveNullAndEmptyArrays: true } },

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                repairRequestId: 1,
                repairInvoiceItemId: 1,
                assignedStaffId: 1,
                technicianId: 1,
                status: 1,
                countWarranty: 1,
                reason: 1,
                diagnosis: 1,
                photosBefore: 1,
                photosAfter: 1,
                createdAt: 1,
                updatedAt: 1,
                repairRequest: 1,
                assignedStaff: 1,
                technician: 1,
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
          page: { $literal: page },
          limit: { $literal: limit },
        },
      },
    ];

    const [res] = await this.model.aggregate(pipeline);
    if (!res || res.total === 0) {
      throw new NotFoundException(
        'Không có lịch sử bảo hành cho người dùng này',
      );
    }
    return res;
  }
}
