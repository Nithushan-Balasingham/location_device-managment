import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { DeviceService } from 'src/device/device.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
    private deviceService: DeviceService,
  ) {}
  async create(dto: CreateLocationDto, userId: number): Promise<Location> {
    try {
      if (!dto.deviceDto || dto.deviceDto.length === 0) {
        throw new Error('No devices provided.');
      }
      const devices = await Promise.all(
        dto.deviceDto.map(async (deviceDto) => {
          const device = await this.deviceService.create(deviceDto);
          return device;
        }),
      );

      const location = this.locationRepo.create({
        ...dto,
        devices: devices,
        user: { id: userId },
      });

      return await this.locationRepo.save(location);
    } catch (error) {
      console.error('Error creating location:', error);
      throw new Error('Error creating location or devices.');
    }
  }

  findAll() {
    return this.locationRepo.find({ relations: ['devices'] });
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
    const location = await this.locationRepo.findOne({ where: { id } });

    if (!location) {
      throw new NotFoundException('Location not found');
    }
    await this.locationRepo.delete(id);
    return { message: 'Location deleted successfully' };
  }
}
