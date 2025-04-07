import { Location } from '../../location/entities/location.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;
  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  hashedRt: string | null;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];
}
