import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { Tokens } from './types';
import { RtGuard } from './common/guards';
import { LoginUserDto } from './dto/login-user.dto';
import { GetCurrentUser, GetCurrentUserId, Public } from './decorators';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  createUser(@Body() dto: CreateUserDto): Promise<{ message: string }> {
    return this.authService.createUser(dto);
  }

  @Post('login')
  signinLocal(@Body() dto: LoginUserDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
  ): Promise<{ success: boolean; message: string }> {
    return this.authService.logout(userId);
  }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get(':id')
  @UseGuards(RtGuard)
  async findOne(
    @Param('id') id: number,
    @Request() req: { user: { sub: number } },
  ) {
    const userId: number = req.user.sub;

    return this.authService.findOne(id, userId);
  }
}
