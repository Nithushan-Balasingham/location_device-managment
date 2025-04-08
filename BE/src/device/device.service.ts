import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { Location } from '../location/entities/location.entity';
import { deleteFile } from 'src/common/utils/file-utils';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
  ) {}
  async createWithLocation(
    dto: CreateDeviceDto & { locationId: number },
  ): Promise<Device> {
    try {
      const location = await this.locationRepo.findOne({
        where: { id: dto.locationId },
      });
      if (!location) {
        throw new BadRequestException(
          `Location with ID '${dto.locationId}' not found.`,
        );
      }

      const device = this.deviceRepo.create({
        ...dto,
        location, 
      });

      return await this.deviceRepo.save(device);
    } catch (error) {
      console.error('Error creating device with location:', error);
      throw error;
    }
  }
  async create(dto: CreateDeviceDto): Promise<Device> {
    try {
      const existingDevice = await this.deviceRepo.findOne({
        where: { serialNumber: dto.serialNumber },
      });
      if (existingDevice) {
        throw new BadRequestException(
          `A device with serial number '${dto.serialNumber}' already exists.`,
        );
      }
      const device = this.deviceRepo.create(dto);
      return await this.deviceRepo.save(device);
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  }
  findAll() {
    return this.deviceRepo.find({ relations: ['location'] });
  }
  async findBySerialNumber(serialNumber: string): Promise<Device | null> {
    return await this.deviceRepo.findOne({ where: { serialNumber } });
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

  async update(
    deviceId: number,
    dto: UpdateDeviceDto,
    file?: Express.Multer.File,
  ): Promise<Device> {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    if (file && device.image) {
      console.log(`Deleting old image: ${device.image}`);
      deleteFile(device.image);
    }

    if (file) {
      console.log('Uploaded file details:', file);
      dto.image = `uploads/devices/${file.filename}`;
      console.log(`New image path: ${dto.image}`);
    }

    Object.assign(device, dto);
    return await this.deviceRepo.save(device);
  }

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

  async delete(deviceId: number): Promise<void> {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    if (device.image) {
      console.log(`Deleting image for device: ${device.image}`);
      deleteFile(device.image);
    }

    await this.deviceRepo.delete(deviceId);
  }
}
