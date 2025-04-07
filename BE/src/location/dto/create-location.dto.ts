import { IsString, IsEnum, IsNotEmpty, IsArray } from 'class-validator';
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
  deviceDto: CreateDeviceDto[];
}
