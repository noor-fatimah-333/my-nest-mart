import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  discountPercentage: number;

  @Column('decimal')
  rating: number;

  @Column()
  stock: number;

  @Column('simple-array')
  tags: string[];

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  sku: string;

  @Column('decimal')
  weight: number;

  @Column('json')
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  @Column({ nullable: true })
  warrantyInformation: string;

  @Column({ nullable: true })
  shippingInformation: string;

  @Column({ nullable: true })
  availabilityStatus: string;

  @Column({ nullable: true })
  returnPolicy: string;

  @Column()
  minimumOrderQuantity: number;

  @Column('json', { nullable: true })
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };

  @Column('simple-array')
  images: string[];

  @Column()
  thumbnail: string;
}
