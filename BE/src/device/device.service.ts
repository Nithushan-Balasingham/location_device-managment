import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
  ) {}
  // async create(dto: CreateDeviceDto): Promise<{ message: string }> {
  //   const location = await this.locationRepo.findOne({
  //     where: { id: Number(dto.locationId) },
  //     relations: ['devices'],
  //   });

  //   if (!location) throw new NotFoundException('Location not found');
  //   if (location.devices.length >= 10)
  //     throw new BadRequestException('Cannot add more than 10 devices');
  //   const existingDevice = await this.deviceRepo.findOne({
  //     where: { serialNumber: dto.serialNumber },
  //   });
  //   if (existingDevice) {
  //     throw new BadRequestException('Device is already added');
  //   }
  //   const device = this.deviceRepo.create({ ...dto, location });
  //   await this.deviceRepo.save(device);
  //   return { message: 'Device is added successfully successfully' };
  // }
  async create(dto: CreateDeviceDto): Promise<Device> {
    const device = this.deviceRepo.create(dto);
    return await this.deviceRepo.save(device);
  }
  findAll() {
    return this.deviceRepo.find({ relations: ['location'] });
  }

  async findOne(id: number) {
    const device = await this.deviceRepo.findOne({
      where: { id },
      relations: ['location'],
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    return this.deviceRepo.findOne({ where: { id } });
  }
  // async update(id: number, updateDeviceDto: UpdateDeviceDto) {
  //   if (!id) {
  //     throw new NotFoundException('Device is not found');
  //   }

  //   const exitingDevice = await this.deviceRepo.findOne({
  //     where: { id },
  //   });

  //   const isLocationExist = await this.locationRepo.findOne({
  //     where: { id: updateDeviceDto.locationId },
  //   });

  //   if (!isLocationExist) {
  //     throw new NotFoundException('Location not found');
  //   }
  //   if (!exitingDevice) {
  //     throw new NotFoundException('Location not found');
  //   }
  //   exitingDevice.location = isLocationExist;
  //   Object.assign(exitingDevice, updateDeviceDto);
  //   return this.deviceRepo.save(exitingDevice);
  // }

  async remove(id: number) {
    if (!id) {
      throw new NotFoundException('Device is not found');
    }
    const Device = await this.deviceRepo.findOne({ where: { id } });

    if (!Device) {
      throw new NotFoundException('Device not found');
    }
    await this.deviceRepo.delete(id);
    return { message: 'Device is deleted successfully' };
  }
}
