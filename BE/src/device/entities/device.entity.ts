import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Image } from '../../images/entities/image.entity';
import { Location } from '../../location/entities/location.entity';

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

  @OneToOne(() => Image)
  @JoinColumn()
  thumbnail: Image;
}
