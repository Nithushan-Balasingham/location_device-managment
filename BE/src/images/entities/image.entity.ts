import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldname: string;

  @Column()
  originalname: string;

  @Column()
  filename: string;
  @Column()
  path: string;
}
