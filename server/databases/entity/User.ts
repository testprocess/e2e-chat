import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn('increment')
    idx: number;

    @Column({ type: "varchar", length: 36 })
    userId: string;

    @Column({ type: "varchar", length: 400 })
    userPassword: string;

    @Column({ nullable: false })
    userEmail: string;
    
    @Column()
    userAuthLevel: number;

    @Column({ type: "varchar", length: 800 })
    userPublicKey: string = '';

    @Column({ type: "varchar", length: 50 })
    createdAt: string;
}