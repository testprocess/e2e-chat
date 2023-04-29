import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: "group" })
export class Group {
    @PrimaryGeneratedColumn('increment')
    idx: number;

    @Column({ type: "varchar", length: 20 })
    groupUUID: string;

    @Column({ type: "varchar", length: 30 })
    groupName: string;

    @Column({ type: "varchar", length: 400 })
    groupDescription: string;
    
    @Column({ type: "varchar", length: 20 })
    groupOwner: string;

    @Column({ type: "varchar", length: 50 })
    createdAt: string;
}