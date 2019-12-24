import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Users {
  constructor(
    id: string,
    username: string,
    password: string,
    email: string,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.lastLogin = lastLogin;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30, unique: true, nullable: false })
  @Unique('Duplicate username', ['username'])
  username: string;

  @Column({ length: 256, nullable: false })
  password: string;

  @Column({ length: 50, unique: true, nullable: false })
  @Unique('Duplicate email', ['email'])
  email: string;

  @Column({ default: new Date() })
  lastLogin: Date;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
