import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriaService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(){
        return await this.prisma.categoria.findMany({
            orderBy:{id:'asc'},
        });
    }

    async findOne(id:number){
        const encontrado = await this.prisma.categoria.findUnique({
            where:{id},
            select:{
                id:true,
                nombre:true,
                productos:{
                    select:{
                        id:true,
                        nombre:true,
                        stock:true,
                    },
                },
            },
        });
        if(!encontrado){
            throw new NotFoundException('Categoria No Encontrada');
        }

        return encontrado;
    }

    async create(data:CreateCategoriaDto){
        return await this.prisma.categoria.create({
            data,
        });
    }

    async update(id:number, data:UpdateCategoriaDto){
        const encontrado = await this.prisma.categoria.findUnique({
            where:{id},
        })
        if(!encontrado){
            throw new NotFoundException('Categoria No Encontrada');
        }

        return await this.prisma.categoria.update({
            where:{id},
            data,
        });
    }

    async remove(id:number){
        const encontrado = await this.prisma.categoria.findUnique({
            where:{id},
            include:{
                productos:true,
            },
        });
        if(!encontrado){
            throw new NotFoundException('Categoria No Encontrada');
        }
        if(encontrado.productos.length > 0){
            throw new BadRequestException('No Puedes Eliminar Si Tiene Productos')
        }

        return await this.prisma.categoria.delete({
            where:{id},
        })
    }

}
