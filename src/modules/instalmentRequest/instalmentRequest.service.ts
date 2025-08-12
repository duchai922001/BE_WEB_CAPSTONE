import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstalmentRequestDto } from './dtos/create.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { InstalmentRequestRepository } from './instalmentRequest.repository';
import * as nodemailer from 'nodemailer';
import { InstalmentRequest } from './instalmentRequest.entity';
import { InstalmentRequestStatus } from 'src/common/enums/instalmentRequest';
import * as dayjs from 'dayjs';
@Injectable()
export class InstalmentRequestService {
  constructor(private readonly repo: InstalmentRequestRepository) {}

  create(userId: string, dto: CreateInstalmentRequestDto) {
    return this.repo.create({
      ...dto,
      userId,
    });
  }

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const request = await this.repo.findById(id);
    if (!request) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return request;
  }

  async updateStatus(id: string, status: string, resultImage?: string) {
    const updated = await this.repo.updateStatus(id, status, resultImage);
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }

  async getRequestsByUser(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async sendRequestEmail(id: string) {
    const request = await this.repo.findById(id);
    if (!request) {
      throw new NotFoundException('Không tìm thấy yêu cầu trả góp');
    }

    await this.sendEmailToBank(request);
    await this.repo.updateStatus(id, InstalmentRequestStatus.SEND_EMAIL);
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
      to: 'Thongtqse173366@fpt.edu.vn', //chỉnh lại theo email ngân hàng
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
