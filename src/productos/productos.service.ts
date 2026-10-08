import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class ProductosService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(categoriaId?:string, page = 1, limit = 10){
        const skip = (page - 1)* limit
        return await this.prisma.producto.findMany({
            where:categoriaId
            ?{categoria:{nombre:categoriaId}}
            :{},
            skip,
            take:limit,
            orderBy:{id:'asc'},
            select:{
                id:true,
                nombre:true,
                precioVenta:true,
                stock:true,
                categoria:{
                    select:{
                        nombre:true,
                    },
                },
            },
        });
    }

    async findAllClient(categoriaId?:string, page = 1, limit = 10){
        const skip = (page - 1)* limit
        return await this.prisma.producto.findMany({
            where: {
                activo: true,
                ...(categoriaId && {
                    categoria: {
                        nombre: categoriaId,
                    },
                }),
            },
            skip,
            take:limit,
            orderBy:{id:'asc'},
            select:{
                id:true,
                nombre:true,
                precioVenta:true,
                stock:true,
                categoria:{
                    select:{
                        nombre:true,
                    },
                },
            },
        });
    }

    async findOne(id:number){
        const encontrado = await this.prisma.producto.findUnique({
            where:{id},
            select:{
                id:true,
                nombre:true,
                precioVenta:true,
                stock:true,
                categoria:{
                    select:{
                        nombre:true,
                    },
                },
            },
        });
        if(!encontrado){
            throw new NotFoundException('Producto No Encontrado');
        }

        return encontrado;
    }

    async create(data:CreateProductoDto){
        return await this.prisma.producto.create({
            data,
        });
    }

    async update(id:number, data:UpdateProductoDto){
        const encontrado = await this.prisma.producto.findUnique({
            where:{id},
        });
        if(!encontrado){
            throw new NotFoundException('Producto No Encontrado');
        }

        return await this.prisma.producto.update({
            where:{id},
            data,
        });
    }

    async remove(id:number){
        const encontrado = await this.prisma.producto.findUnique({
            where:{id},
        });
        if(!encontrado){
            throw new NotFoundException('Producto No Encontrado');
        }

        return await this.prisma.producto.delete({
            where:{id},
        })
    }
}
