import { IsEmail, IsString, MinLength } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  hashedRt?: string;
}
