import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum DeviceType {
  POS = 'pos',
  KIOSK = 'kiosk',
  SIGNAGE = 'signage',
}

export enum DeviceStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}

export class CreateDeviceDto {
  @IsString()
  serialNumber: string;

  @IsEnum(DeviceType)
  type: DeviceType;

  @IsOptional()
  @IsString()
  image?: string;

  // @IsString()
  // imagePath?: string;
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  
}
