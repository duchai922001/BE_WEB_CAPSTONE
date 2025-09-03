import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstalmentRequestDto } from './dtos/create.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { InstalmentRequestRepository } from './instalmentRequest.repository';
import * as nodemailer from 'nodemailer';
import { InstalmentRequest } from './instalmentRequest.entity';
import { InstalmentRequestStatus } from 'src/common/enums/instalmentRequest';
import * as dayjs from 'dayjs';
import { AttributeService } from '../attributes/attribute.service';
import { Types } from 'mongoose';
import { PromotionRepository } from '../promotion/promotion.repository';
import { CartItemRepository } from '../cartItem/cartItem.repository';
import { ProductImageRepository } from '../productImage/productImage.repository';
import { UserService } from '../users/user.service';
import { NotificationType } from 'src/common/enums/notification-type';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
@Injectable()
export class InstalmentRequestService {
  constructor(
    private readonly userService: UserService,
    private readonly repo: InstalmentRequestRepository,
    private readonly attributeSer: AttributeService,
    private readonly promoRepo: PromotionRepository,
    private readonly cartItemRepository: CartItemRepository,
    private readonly productImage: ProductImageRepository,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(userId: string, dto: CreateInstalmentRequestDto) {
    const { cartItemId, ...payload } = dto;

    if (cartItemId) {
      await this.cartItemRepository.delete(cartItemId);
    }

    const MAX_RETRIES = 5;
    let retry = 0;
    let instalmentRequestOrder: string;
    let request: any;

    while (retry < MAX_RETRIES) {
      instalmentRequestOrder = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      try {
        request = await this.repo.create({
          ...payload,
          userId,
          instalmentRequestOrder,
        });

        const consultants = await this.userService.getConsultants();
        for (const consultant of consultants) {
          const notif = await this.notificationService.create({
            userId: (consultant as any)._id.toString(),
            title: 'Đơn trả góp vừa được tạo',
            message: `Đơn trả góp có mã ${instalmentRequestOrder} vừa được tạo`,
            type: NotificationType.ORDER,
            targetUrl: `/permission/manage-instalment-request?instalmentRequestOrder=${instalmentRequestOrder}`,
          });

          this.notificationGateway.sendNotification(
            (consultant as any)._id.toString(),
            notif,
          );
        }

        break;
      } catch (error: any) {
        if (
          error?.code === 11000 &&
          (error?.keyPattern?.instalmentRequestOrder ||
            error?.keyValue?.instalmentRequestOrder)
        ) {
          retry++;
          continue;
        }
        throw error;
      }
    }

    if (!request) {
      throw new Error(
        'Could not create unique instalmentRequestOrder after retries',
      );
    }

    return request;
  }

  findAll() {
    return this.repo.findAll();
  }
  async getRequestsByStaff(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.repo.getRequestsByStaff(
      userId,
      (user?.roleId as any)?.name,
    );
  }
  async findById(id: string) {
    const request = await this.repo.findById(id);
    if (!request) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);

    const promo = await this.promoRepo.findValidByProductId(
      (request.productId as any)._id,
    );

    let attributes: any[] = [];
    if (request.variableId) {
      attributes = await this.attributeSer.findByVariableId(
        (request.variableId as any)._id,
      );
    }

    const defaultImage = await this.productImage.findDefaultImageByProductId(
      String((request.productId as any)._id),
    );

    return {
      ...request,
      attributes,
      promo,
      image: defaultImage?.url || null,
    };
  }

  async updateStatus(id: string, status: string, resultImage?: string) {
    const updated = await this.repo.updateStatus({
      id: id,
      status: status,
      resultImage,
    });
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }

  async getRequestsByUser(userId: string) {
    const requests = await this.repo.findByUserId(userId);

    return Promise.all(
      requests.map(async (request) => {
        const promo = await this.promoRepo.findValidByProductId(
          (request.productId as any)._id,
        );

        const attributes = request.variableId
          ? await this.attributeSer.findByVariableId(
              (request.variableId as any)._id,
            )
          : [];

        const defaultImage =
          await this.productImage.findDefaultImageByProductId(
            String((request.productId as any)._id),
          );

        return {
          ...request.toObject(),
          promo,
          attributes: attributes || [],
          image: defaultImage?.url || null,
        };
      }),
    );
  }

  async sendRequestEmail(id: string, userId: string) {
    const request = await this.repo.findById(id);
    if (!request) {
      throw new NotFoundException('Không tìm thấy yêu cầu trả góp');
    }

    await this.sendEmailToBank(request);
    await this.repo.updateStatus({
      id: id,
      status: InstalmentRequestStatus.SEND_EMAIL,
      assignedStaffId: userId,
    });
  }

  private async sendEmailToBank(request: InstalmentRequest) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Yêu cầu trả góp" <${process.env.EMAIL_USER}>`,
      to: 'minhkhangg32@gmail.com', //chỉnh lại theo email ngân hàng
      subject: 'Yêu cầu trả góp mới',
      html: `
        <h3>Thông tin yêu cầu trả góp</h3>
        <p><b>Họ tên:</b> ${request.fullName}</p>
        <p><b>Số điện thoại:</b> ${request.phone}</p>
        <p><b>Địa chỉ:</b> ${request.address}</p>
         <p><b>Ngày hẹn:</b> ${dayjs(request.appointmentDate).format('DD-MM-YYYY HH:mm')}</p>
        <p><b>Thu nhập:</b> ${request.income}</p>
        <p><b>Nghề nghiệp:</b> ${request.occupation}</p>
        <p><b>CMND/CCCD:</b> ${request.documentType} - ${request.documentNumber}</p>
        <p><b>Ảnh mặt trước:</b><br/>
          <img src="${request.idFrontUrl}" alt="Ảnh mặt trước" style="max-width:300px;" />
        </p>
        <p><b>Ảnh mặt sau:</b><br/>
          <img src="${request.idBackUrl}" alt="Ảnh mặt sau" style="max-width:300px;" />
        </p>
        <p><b>Ghi chú:</b> ${request.note || ''}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
