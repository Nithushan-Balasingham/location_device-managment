import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepo: Repository<Location>,
  ) {}
  async create(dto: CreateLocationDto, userId: number): Promise<Location> {
    const location = this.locationRepo.create({
      ...dto,
      user: { id: userId },
    });

    return this.locationRepo.save(location);
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
