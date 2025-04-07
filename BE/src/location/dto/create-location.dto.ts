import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

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
}
