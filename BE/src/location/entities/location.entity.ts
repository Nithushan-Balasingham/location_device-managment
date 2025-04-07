import { User } from '../../auth/entities/user.entity';
import { Device } from '../../device/entities/device.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column({ default: 'Active' })
  status: 'Active' | 'InActive';

  @OneToMany(() => Device, (device) => device.location, { cascade: true })
  devices: Device[];

  @ManyToOne(() => User, (user) => user.locations, {
    eager: false,
    nullable: false,
  })
  user: User;
}
