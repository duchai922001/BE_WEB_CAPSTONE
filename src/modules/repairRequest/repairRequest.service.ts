import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { RepairRequestRepository } from './repairRequest.repository';
import {
  CreateRepairRequestDto,
  RepairRequestServices,
} from './dtos/customer-create-repair-request.dto';
import { RepairRequestServiceReprository } from '../repairRequestService/repairRequestService.repository';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { RepairRequestImageService } from '../repairRequestImage/repairRequestImage.service';
import { RepairImageType } from '../repairRequestImage/repairRequestImage.entity';
import { UpdateRepairRequestTimestampDto } from './dtos/update-repair-request-timestamp.dto';
import { UpdateRepairRequestInfoDto } from './dtos/update.dto';
import { RepairRequestStatus } from 'src/common/enums/repairRequestStatus';
import { RepairRequest, RepairRequestDocument } from './repairRequest.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RepairInvoiceItemRepository } from '../repair-invoice-item/repair-invoice-item.repository';
import { RepairWarrantyPolicyRepository } from '../repair-warranty-policy/repair-warranty-policy.repository';
import { RepairServiceRepository } from '../repairService/repairService.repository';
import { formatTimeLeft, parseDuration } from 'src/common/utils/parseDuration';
import * as nodemailer from 'nodemailer';
import * as dayjs from 'dayjs';
import { UpdateCustomerPaidDto } from './dtos/customer-paid.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationType } from 'src/common/enums/notification-type';
import { UserService } from '../users/user.service';
@Injectable()
export class RepairRequestService {
  constructor(
    @InjectModel(RepairRequest.name)
    private readonly model: Model<RepairRequestDocument>,
    private readonly repairRequestRepo: RepairRequestRepository,
    private readonly repairRequestSeviceRepo: RepairRequestServiceReprository,
    private readonly repairRequestImageService: RepairRequestImageService,
    private readonly repairWarrantyPolicyRepo: RepairWarrantyPolicyRepository,
    private readonly repairInvoiceItemRepo: RepairInvoiceItemRepository,
    private readonly repairServiceRepo: RepairServiceRepository,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, data: CreateRepairRequestDto) {
    const { repairRequestServices, imageDeviceBefore, ...payloadOther } = data;

    const MAX_RETRIES = 5;
    let retry = 0;
    let repairRequestCode: string;
    let repairRequest: any;

    while (retry < MAX_RETRIES) {
      repairRequestCode = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      try {
        repairRequest = await this.repairRequestRepo.create({
          ...payloadOther,
          userId: userId,
          repairRequestCode,
        });
        const consultants = await this.userService.getConsultants();

        for (const consultant of consultants) {
          const notif = await this.notificationService.create({
            userId: (consultant as any)._id.toString(),
            title: 'Đơn sửa chữa vừa được tạo',
            message: `Đơn sửa chữa có mã đơn ${repairRequestCode} vừa được tạo`,
            type: NotificationType.ORDER,
            targetUrl: `/permission/manage-repair-request?repairRequestCode=${repairRequestCode}`,
          });

          this.notificationGateway.sendNotification(
            (consultant as any)._id.toString(),
            notif,
          );
        }
        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.repairRequestCode) {
          retry++;
          continue;
        }
        throw error;
      }
    }

    if (!repairRequest) {
      throw new Error(
        'Could not create unique repairRequestCode after retries',
      );
    }

    if (imageDeviceBefore?.length) {
      await Promise.all(
        imageDeviceBefore.map((url: string) =>
          this.repairRequestImageService.create({
            repairRequestId: repairRequest._id.toString(),
            url,
            note: '',
            type: RepairImageType.BEFORE,
          }),
        ),
      );
    }

    if (repairRequestServices?.length) {
      await Promise.all(
        repairRequestServices.map((item: RepairRequestServices) =>
          this.repairRequestSeviceRepo.create({
            repairRequestId: repairRequest._id,
            repairServiceId: item.repairServiceId,
            note: item.note,
          }),
        ),
      );
    }
    return repairRequest;
  }
  async createRepairAdmin(userId: string, data: CreateRepairRequestDto) {
    const {
      repairRequestServices,
      imageDeviceBefore,
      technicianId,
      ...payloadOther
    } = data;
    const user = await this.userService.createUserUnActive({
      fullName: data.customerName,
      phone: data.customerPhone,
    });
    const MAX_RETRIES = 5;
    let retry = 0;
    let repairRequestCode: string;
    let repairRequest: any;

    while (retry < MAX_RETRIES) {
      repairRequestCode = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      try {
        repairRequest = await this.repairRequestRepo.create({
          ...payloadOther,
          userId: (user as any)._id,
          repairRequestCode,
          assignedStaffId: userId,
          technicianId,
          status: technicianId
            ? RepairRequestStatus.ASSIGNED_TECHNICAL
            : RepairRequestStatus.ASSIGNED,
        });
        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.repairRequestCode) {
          retry++;
          continue;
        }
        throw error;
      }
    }

    if (!repairRequest) {
      throw new Error(
        'Could not create unique repairRequestCode after retries',
      );
    }

    if (imageDeviceBefore?.length) {
      await Promise.all(
        imageDeviceBefore.map((url: string) =>
          this.repairRequestImageService.create({
            repairRequestId: repairRequest._id.toString(),
            url,
            note: '',
            type: RepairImageType.BEFORE,
          }),
        ),
      );
    }

    if (repairRequestServices?.length) {
      await Promise.all(
        repairRequestServices.map((item: RepairRequestServices) =>
          this.repairRequestSeviceRepo.create({
            repairRequestId: repairRequest._id,
            repairServiceId: item.repairServiceId,
            note: item.note,
          }),
        ),
      );
    }
    return repairRequest;
  }
  async getByUserId(userId: string) {
    const repairRequests = await this.repairRequestRepo.getByUserId(userId);
    return repairRequests;
  }

  async findById(id: string) {
    const result = await this.repairRequestRepo.findById(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);

    const images =
      await this.repairRequestImageService.findByRepairRequestIdGrouped(id);

    return {
      ...(result.toObject?.() ?? result),
      imageBefore: images.imageBefore,
      imageAfter: images.imageAfter,
    };
  }

  findAll(query: BaseQueryDto) {
    return this.repairRequestRepo.findAll(query);
  }

  async updateStatus(id: string, status: string) {
    const result = await this.repairRequestRepo.updateStatus(id, status);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }

  async delete(id: string) {
    const result = await this.repairRequestRepo.delete(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }

  async assignStaffAndTechnician(
    id: string,
    assignedStaffId?: string,
    technicianId?: string,
  ) {
    const updatedRequest =
      await this.repairRequestRepo.assignStaffAndTechnician(
        id,
        assignedStaffId,
        technicianId,
      );
    if (!updatedRequest) {
      throw new NotFoundException('Repair request not found');
    }
    if (technicianId) {
      const notif = await this.notificationService.create({
        userId: technicianId,
        title: 'Bạn được giao làm kỹ thuật viên',
        message: `Bạn vừa được giao làm kỹ thuật viên cho đơn ${updatedRequest.repairRequestCode}`,
        type: NotificationType.ORDER,
        targetUrl: `/permission/manage-repair-request?repairRequestCode=${updatedRequest.repairRequestCode}`,
      });
      this.notificationGateway.sendNotification(technicianId, notif);
    }
    return updatedRequest;
  }

  async updateTimestamp(dto: UpdateRepairRequestTimestampDto) {
    const allowedFields = [
      'dropoffActualDate',
      'processingDate',
      'pickupAppointmentDate',
      'completionDate',
      'customerConfirmDate',
      'cancelledDate',
    ];

    if (!allowedFields.includes(dto.field)) {
      throw new BadRequestException('Field không hợp lệ');
    }

    const updated = await this.repairRequestRepo.updateTimestampByField(
      dto.repairRequestId,
      dto.field,
    );
    if (!updated) {
      throw new NotFoundException('Repair request not found');
    }

    if (dto.field === 'customerConfirmDate') {
      await this.updateStatus(
        dto.repairRequestId,
        RepairRequestStatus.CUSTOMER_CONFIRMED,
      );
      await this.repairRequestRepo.updateInfo(dto.repairRequestId, {
        customerDept: dto.customerDebt,
      });

      const notif = await this.notificationService.create({
        userId: updated?.technicianId?.toString(),
        title: 'Khách hàng đã xác nhận sửa chữa',
        message: `Tiến hành sữa chữa đơn hàng ${updated.repairRequestCode}`,
        type: NotificationType.ORDER,
        targetUrl: `/permission/manage-repair-request?repairRequestCode=${updated.repairRequestCode}`,
      });
      this.notificationGateway.sendNotification(
        updated?.technicianId?.toString(),
        notif,
      );
    }

    if (dto.field === 'processingDate') {
      await this.updateStatus(
        dto.repairRequestId,
        RepairRequestStatus.WAIT_CUSTOMER_RECEIVE,
      );
      const notif = await this.notificationService.create({
        userId: updated?.assignedStaffId?.toString(),
        title: 'Nhân viên kỹ thuật đã hoàn thành sữa chữa',
        message: `Kiểm tra lại đơn hàng ${updated.repairRequestCode}`,
        type: NotificationType.ORDER,
        targetUrl: `/permission/manage-repair-request?repairRequestCode=${updated.repairRequestCode}`,
      });
      this.notificationGateway.sendNotification(
        updated?.assignedStaffId?.toString(),
        notif,
      );
    }

    if (dto.field === 'completionDate') {
      await this.updateStatus(
        dto.repairRequestId,
        RepairRequestStatus.COMPLETED,
      );
    }
    if (dto.field === 'pickupAppointmentDate') {
      const repairRequest = await this.repairRequestRepo.findById(
        dto.repairRequestId,
      );
      if (!repairRequest) {
        throw new NotFoundException('Không tìm thấy yêu cầu sửa chữa');
      }
      const email = (repairRequest.userId as any)?.email;
      const fullName = (repairRequest.userId as any)?.fullName || 'Khách hàng';
      if (email) {
        const fromDate = dayjs().add(1, 'day');
        const toDate = dayjs().add(7, 'day');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Thông báo nhận hàng" <${process.env.EMAIL_USER}>`,
          to: email, // lấy email từ user
          subject: 'Thông báo lịch hẹn nhận hàng',
          html: `
          <h3>Xin chào ${fullName || ''}</h3>
          <p>Đơn sửa chữa của bạn đã sẵn sàng để nhận.</p>
           <p>Mã đơn hàng: ${repairRequest.repairRequestCode}</p>
           <i>Bạn đến cửa hàng đọc mã đơn hàng cho nhân viên để được hổ trợ nhanh nhất</i>
         <p><b>Ngày hẹn nhận:</b> 
    ${fromDate.format('DD-MM-YYYY HH:mm')} 
    → 
    ${toDate.format('DD-MM-YYYY HH:mm')}
  </p>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `,
        };
        await transporter.sendMail(mailOptions);
      }
    }

    return updated;
  }

  async updateRepairInfo(id: string, dto: UpdateRepairRequestInfoDto) {
    await this.repairRequestRepo.updateInfo(id, {
      deviceSerial: dto.deviceSerial,
      issueDescription: dto.issueDescription,
    });

    if (dto.imageAfter?.length) {
      await Promise.all(
        dto.imageAfter.map((url) =>
          this.repairRequestImageService.create({
            repairRequestId: id,
            url,
            note: '',
            type: RepairImageType.AFTER,
          }),
        ),
      );
    }

    return { success: true };
  }
  async searchWithWarranty(keyword: string) {
    const repairRequests =
      await this.repairRequestRepo.searchRepairRequest(keyword);

    if (!repairRequests || repairRequests.length === 0) {
      throw new NotFoundException('Không tìm thấy đơn sửa chữa');
    }

    const results = await Promise.all(
      repairRequests.map(async (req) => {
        const invoiceItems =
          await this.repairInvoiceItemRepo.findByRepairRequestIdWithPolicy(
            String(req._id),
          );
        const itemsWithWarranty = invoiceItems.map((item) => {
          const plainItem = item.toObject();

          const completionDateRaw = (plainItem.repairRequestId as any)
            ?.completionDate;
          const completionDate = completionDateRaw
            ? new Date(completionDateRaw)
            : new Date();

          const durationStr =
            (plainItem.repairServiceId as any)?.repairWarrantyPolicyId
              ?.duration || '3m';

          const durationMs = parseDuration(durationStr);

          const expiryDate = new Date(completionDate.getTime() + durationMs);

          const now = new Date();
          const isExpired = now > expiryDate;

          const timeLeftMs = isExpired
            ? 0
            : expiryDate.getTime() - now.getTime();

          return {
            ...plainItem,
            warranty: {
              duration: durationStr,
              expiryDate,
              isExpired,
              timeLeft: formatTimeLeft(timeLeftMs),
            },
          };
        });

        return {
          ...req,
          invoiceItems: itemsWithWarranty,
        };
      }),
    );

    return results;
  }

  async updateCustomerPaid(dto: UpdateCustomerPaidDto) {
    const repairRequest = await this.repairRequestRepo.findById(
      dto.repairRequestId,
    );
    if (!repairRequest) {
      throw new NotFoundException('Repair request not found');
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Số tiền phải lớn hơn 0');
    }

    const currentDept = repairRequest.customerDept || 0;

    if (dto.amount > currentDept) {
      throw new BadRequestException(
        `Số tiền không được vượt quá số còn nợ: ${currentDept}`,
      );
    }

    return this.repairRequestRepo.updateCustomerPaid(
      dto.repairRequestId,
      dto.amount,
    );
  }

  async getTechnicianStats(technicianId: string) {
    return await this.repairRequestRepo.getTechnicianStats(technicianId);
  }

  async getRequestsByUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.repairRequestRepo.getRequestsByUser(
      userId,
      (user?.roleId as any)?.name,
    );
  }
}
