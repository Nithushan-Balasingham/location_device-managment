import { Location } from '../../location/entities/location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  serialNumber: string;

  @Column()
  type: 'pos' | 'kiosk' | 'signage';

  @Column({ nullable: true })
  image: string;

  @Column({ default: 'Active' })
  status: 'Active' | 'InActive';

  @ManyToOne(() => Location, (location) => location.devices)
  location: Location;
}
