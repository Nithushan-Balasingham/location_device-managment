import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, Tokens } from './types';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<{ message: string }> {
    const existingUser = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User Already Exists');
    }

    const hashedPassword = await argon.hash(dto.password);
    const newUser = this.usersRepo.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    });
    await this.usersRepo.save(newUser);
    return {
      message: 'User created successfully',
    };
  }

  async signinLocal(dto: LoginUserDto): Promise<any> {
    const user = await this.usersRepo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        locations: user.locations,
      },
    };
  }
  async logout(userId: number): Promise<{ success: boolean; message: string }> {
    console.log('USER', userId);

    const user = await this.usersRepo.findOne({
      where: {
        id: userId,
        hashedRt: Not(IsNull()),
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'No active session to log out from.',
      };
    }

    user.hashedRt = null;

    await this.usersRepo.save(user);

    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);

    await this.usersRepo.update(userId, {
      hashedRt: hash,
    });
  }
  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findOne(id: number, userId: number) {
    if (id !== userId) {
      throw new ForbiddenException('You are not authorized ');
    }

    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['locations'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
