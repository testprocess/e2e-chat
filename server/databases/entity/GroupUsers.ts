import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: "groupusers" })
export class GroupUsers {
    @PrimaryGeneratedColumn('increment')
    idx: number;
    
    @Column({ type: "varchar", length: 20 })
    groupUUID: string;
    
    @Column({ type: "varchar", length: 20 })
    userId: string;

    @Column({ type: "varchar", length: 50 })
    joinAt: string;
}