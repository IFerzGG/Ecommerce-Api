import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoPedido } from '../generated/prisma/enums.js';
import { CreateDireccionDto } from './dto/create-direccion.dto.js';
import { UpdateDireccionDto } from './dto/update-direccion.dto.js';

@Injectable()
export class DireccionesService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(){
        return await this.prisma.direccion.findMany({
            orderBy:[
                {userId:'asc'},
                {id:'asc'},
            ],
            include:{
                user:{
                    select:{
                        nombre:true,
                    },
                },
            },
        });
    }

    async findOne(id:number){
        const direccion = await this.prisma.direccion.findUnique({
            where:{id},
            include:{
                user:{
                    select:{
                        nombre:true,
                    },
                },
            },
        });
        if(!direccion){
            throw new NotFoundException('Direccion no encontrada')
        }
        return direccion;
    }

    async findByUser(id:number){
        const direccion = await this.prisma.direccion.findMany({
            where:{userId:id},
            orderBy:{id:'asc'},
            include:{
                user:{
                    select:{
                        nombre:true,
                    }
                }
            }
        });
        if(!direccion){
            throw new NotFoundException('Direccion no encontrada')
        }
        return direccion;
    }

    async create(id:number, data:CreateDireccionDto){
        return await this.prisma.direccion.create({
            data:{
                calle:data.calle,
                ciudad:data.ciudad,
                pais:data.pais,
                codigoPostal:data.codigoPostal,
                referencia:data.referencia,
                userId:id,
            }
        });
    }

    async update(id:number, data:UpdateDireccionDto){
        const direccion = await this.prisma.direccion.findUnique({
            where:{id},
        });
        if(!direccion){
            throw new NotFoundException('Direccion no encontrada')
        }

        return await this.prisma.direccion.update({
            where:{id},
            data,
        });
    }

    async updateByUser(id:number,userId:number, data:UpdateDireccionDto){
        const direccion = await this.prisma.direccion.findFirst({
            where:{
                id,
                userId,
            },
        })
        if(!direccion){
            throw new NotFoundException('Direccion No Encontrada');
        }

        return await this.prisma.direccion.update({
            where:{id},
            data,
        })
    }

    async remove(id:number){
        const direccion = await this.prisma.direccion.findUnique({
            where:{id},
        })
        if(!direccion){
            throw new NotFoundException('Direccion No Encontrada');
        }
        return await this.prisma.direccion.delete({
            where:{id},
        });
    }
    
    async removeByUser(id:number,userId:number){
        const direccion = await this.prisma.direccion.findFirst({
            where:{
                id,
                userId,
            },
        })
        if(!direccion){
            throw new NotFoundException('Direccion No Encontrada');
        }

        return await this.prisma.direccion.delete({
            where:{id},
        });
    }
}
