import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { changeProfilePassword } from './dtos/change-profile-password';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('register')
  async create(@Body() dto: CreateUserDto) {
    const data = await this.userService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo user thành công');
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect tới Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const user = req.user;
    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    res.redirect(`https://www.bluetoothmobile.vn?token=${token}`);
  }
  @Get('')
  async getAll(@Query() query: BaseQueryDto) {
    const data = await this.userService.getAll(query);
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách User thành công');
  }
  @Get('get-phone/:phone')
  async getUserByPhone(@Param('phone') phone: string) {
    const data = await this.userService.findByPhone(phone);
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách User thành công');
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = (req as any).user.userId;
    const user = await this.userService.getById(userId);
    return {
      statusCode: 200,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }

  @Get('technicians')
  async getTechnicians() {
    const data = await this.userService.getTechnicians();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
  @Get('staff-system')
  async getStaffSystem() {
    const data = await this.userService.getUsersExcludeAdminAndCustomer();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
  @Get('customers')
  async getCustomers() {
    const data = await this.userService.getCustomers();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.getById(id);
    return createResponse(HttpStatus.OK, user, 'Lấy người dùng thành công');
  }

  @Post('auth')
  async validateUser(@Body() body: { phone: string; password: string }) {
    const data = await this.userService.validateUser(body.phone, body.password);
    return createResponse(HttpStatus.OK, data, 'Đăng nhập thành công');
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updated = await this.userService.updateUserBasicInformation(id, dto);
    return createResponse(
      HttpStatus.OK,
      updated,
      'Cập nhật người dùng thành công',
    );
  }
  @Patch(':id/update-email')
  async updateUserEmail(
    @Param('id') id: string,
    @Body() body: { email: string },
  ) {
    const updatedUser = await this.userService.updateEmail(id, body.email);
    return updatedUser;
  }

  @Put('change-forgot-password/:id')
  async changeForgotPassword(
    @Param('id') id: string,
    @Body() body: { hashedPassword: string },
  ) {
    const result = await this.userService.changeForgotPassword(id, body);
    return createResponse(HttpStatus.OK, result, 'Đổi mật khẩu thành công');
  }

  @Put('change-profile-password/:id')
  async changeProfilePassword(
    @Param('id') id: string,
    @Body() dto: changeProfilePassword,
  ) {
    const result = await this.userService.changeProfilePassword(id, dto);
    return createResponse(HttpStatus.OK, result, 'Đổi mật khẩu thành công');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'Xóa người dùng thành công' };
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @Permissions(PermissionSystem.TEST, PermissionSystem.CREATE_USER)
  @Post('admin-only')
  getForAdmin() {
    return 'Chỉ Admin mới truy cập được';
  }
}
