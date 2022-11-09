import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
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
}
