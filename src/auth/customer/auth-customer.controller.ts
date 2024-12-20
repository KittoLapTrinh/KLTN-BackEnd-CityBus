import { CustomerRegisterDto } from './dto/create-customer.dto';
import { CurrentUser } from '../../decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { CustomerLoginDto, CustomerRefreshTokenDto, SendOtpDto } from './dto';
import { AuthCustomerService } from './auth-customer.service';

@Controller('auth/user')
@ApiTags('Auth User')
export class AuthCustomerController {
  constructor(private authCustomerService: AuthCustomerService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CustomerRegisterDto) {
    return this.authCustomerService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: CustomerLoginDto) {
    return this.authCustomerService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user) {
    return this.authCustomerService.logout(user.id);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() dto: CustomerRefreshTokenDto) {
    return this.authCustomerService.refreshTokens(dto.refreshToken);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authCustomerService.sendOtp(dto);
  }

  @Get('profile')
  // @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async profile(@CurrentUser() user) {
    return this.authCustomerService.profile(user?.id);
  }
}
