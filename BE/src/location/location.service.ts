import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { DeviceService } from 'src/device/device.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { deleteFile } from 'src/common/utils/file-utils';
import { Device } from 'src/device/entities/device.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
    private deviceService: DeviceService,
  ) {}

  async create(
    dto: CreateLocationDto,
    files: Array<Express.Multer.File>,
    userId: number,
  ): Promise<Location> {
    console.log('Files in service:', files);
    console.log('DTO:', dto);

    if (files.length !== dto.deviceDto.length) {
      throw new Error('Number of files does not match the number of devices');
    }
    for (const deviceDto of dto.deviceDto) {
      const existingDevice = await this.deviceService.findBySerialNumber(
        deviceDto.serialNumber,
      );
      if (existingDevice) {
        throw new BadRequestException(
          `A device with serial number '${deviceDto.serialNumber}' already exists.`,
        );
      }
    }
    const devices = await Promise.all(
      dto.deviceDto.map((deviceDto, index) => {
        const file = files[index];
        if (file) {
          console.log('File being processed:', file);
          deviceDto.image = `uploads/devices/${file.filename}`;
        }
        return this.deviceService.create(deviceDto);
      }),
    );

    const location = this.locationRepo.create({
      ...dto,
      devices,
      user: { id: userId },
    });

    return await this.locationRepo.save(location);
  }
  async findBySerialNumber(serialNumber: string): Promise<Device | null> {
    return await this.deviceService.findBySerialNumber(serialNumber);
  }
  async findAll(): Promise<Location[]> {
    const locations = await this.locationRepo.find({ relations: ['devices'] });

    return locations.map((location) => {
      location.devices = location.devices.map((device) => {
        if (device.image) {
          device.image = `http://localhost:8080/${device.image}`;
        }
        return device;
      });
      return location;
    });
  }

  async findOne(id: number) {
    const location = await this.locationRepo.findOne({
      where: { id },
      relations: ['devices'],
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return this.locationRepo.findOne({ where: { id } });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    if (!id) {
      throw new NotFoundException('Location is not found');
    }

    const existingLocation = await this.locationRepo.findOne({
      where: { id },
    });

    if (!existingLocation) {
      throw new NotFoundException('Location not found');
    }
    Object.assign(existingLocation, updateLocationDto);
    return this.locationRepo.save(existingLocation);
  }

  async remove(id: number) {
    if (!id) {
      throw new NotFoundException('Location is not found');
    }

    const location = await this.locationRepo.findOne({
      where: { id },
      relations: ['devices'],
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    if (location.devices && location.devices.length > 0) {
      location.devices.forEach((device) => {
        if (device.image) {
          console.log(`Deleting image for device: ${device.image}`);
          deleteFile(device.image);
        }
      });
    }

    await this.locationRepo.delete(id);

    return {
      message: 'Location and its associated devices deleted successfully',
    };
  }
}
