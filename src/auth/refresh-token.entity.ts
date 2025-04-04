import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  googleId: string;

  @Column()
  token: string; //refresh token

  @Column()
  expiresAt: Date;
}
