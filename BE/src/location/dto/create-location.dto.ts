import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDeviceDto } from 'src/device/dto/create-device.dto';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEnum(['Active', 'InActive'])
  status: 'Active' | 'InActive';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeviceDto)
  deviceDto: CreateDeviceDto[];
}
