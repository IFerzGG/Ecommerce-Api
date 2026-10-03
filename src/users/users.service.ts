import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateUserDto } from './dto/create-user.dto.js';
import bcrypt from "bcrypt";
import { Role } from '../generated/prisma/enums.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    async findAll(){
        return await this.prisma.user.findMany({
            orderBy:{id:"asc"},
            select:{
                id: true,
                nombre: true,
                email: true,
                role: true,
            },
        });
    }

    async findOne(id:number){
        const encontrado = await this.prisma.user.findUnique({
            where:{id},
            select:{
                id: true,
                nombre: true,
                email: true,
                role: true,
            },
        });
        if(!encontrado){
            throw new NotFoundException("Usuario No Encontrado");
        }

        return encontrado;
    }

    async findByEmail(email:string){
        return await this.prisma.user.findUnique({
            where:{email},
            select:{
                id:true,
                nombre:true,
                email:true,
                role:true,
                password:true,
            }
        });
    }

    async create(data:CreateUserDto){
        const hashpassword = await bcrypt.hash(data.password,10);
        return await this.prisma.user.create({
            data:{
                nombre: data.nombre,
                email: data.email,
                password: hashpassword,
                role: data.role || Role.CLIENT,
            },
            select:{
                id:true,
                nombre:true,
                email:true,
                role:true,
            },
        });
    }

    async update(id:number, data:UpdateUserDto){
        const encontrado = await this.prisma.user.findUnique({
            where:{id},
        });
        if(!encontrado){
            throw new NotFoundException("Usuario No Encontrado");
        }

        const updateDataPassword = {
            ...data,
            ...(data.password && {
                password: await bcrypt.hash(data.password,10)
            }),
        };

        return await this.prisma.user.update({
            where:{id},
            data:updateDataPassword,
        });
    }

    async remove(id:number){
        const encontrado =  await this.prisma.user.findUnique({
            where:{id},
        });
        if(!encontrado){
            throw new NotFoundException("Usuario No Encontrado");
        }

        return await this.prisma.user.delete({
            where:{id},
        });
    }
}
