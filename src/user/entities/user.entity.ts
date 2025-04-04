import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ default: 'user' }) // 'admin' or 'user'
  role: string;

  @Column({ nullable: true }) // New field for Google ID
  googleId: string;

  @Column({ nullable: true }) // New field for user's name
  name: string;
}
