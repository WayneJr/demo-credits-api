import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { DepositFundsDto } from './dto/transaction.dto';
import { WebhookPayload } from '../../core/utils/interfaces/paystack.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('deposit')
  async depositFunds(@Body() body: DepositFundsDto) {
    return this.userService.depositFunds({
      amount: body.amount,
      email: body.email,
      transactionPin: body.transactionPin,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify/deposit')
  async verifyTransaction(@Request() req, @Body() body: WebhookPayload) {
    return this.userService.verifyDeposit({
      body,
      headers: req.headers,
    });
  }
}
