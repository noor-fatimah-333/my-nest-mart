import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  @Column()
  date: Date;

  @Column()
  reviewerName: string;

  @Column()
  reviewerEmail: string;
}
