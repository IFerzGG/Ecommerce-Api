import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MovimientoCajaDto } from './dto/movimientoCaja.dto.js';
import { UpdateMovCajaDto } from './dto/update-caja.dto.js';


@Injectable()
export class MovCajasService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(id:number){
        const movimientos =  await this.prisma.movimientoCaja.findMany({
            where:{cajaId:id},
            orderBy:{id:'asc'},
        });

        return movimientos;
    }

    async create(id:number, data:MovimientoCajaDto){
        const existe = await this.prisma.caja.findUnique({
            where:{id},
        });
        if(!existe){
            throw new NotFoundException('Caja no Encontrada');
        }
        if(existe.estado === 'CERRADA'){
            throw new BadRequestException('Caja ya Cerrada');
        }

        return await this.prisma.movimientoCaja.create({
            data:{
                tipo:data.tipo,
                monto:data.monto,
                cajaId:id,
            },
        });
    }

    async createByCaja(id:number, usuarioId:number,data:MovimientoCajaDto){
        const existe = await this.prisma.caja.findUnique({
            where:{id},
        });
        if(!existe){
            throw new NotFoundException('Caja Inexistente');
        }
        if(existe.estado === 'CERRADA'){
            throw new BadRequestException('Caja ya Cerrada');
        }
        if(existe.usuarioId !== usuarioId){
            throw new ForbiddenException('No Tienes Permiso Para Agregar Movimiento');
        }
        return await this.prisma.movimientoCaja.create({
            data:{
                tipo:data.tipo,
                monto:data.monto,
                cajaId:id,
            },
        });
    }

    async update(id:number, data:UpdateMovCajaDto){
        const existe = await this.prisma.movimientoCaja.findUnique({
            where:{id},
        });
        if(!existe){
            throw new NotFoundException('No se Encuentra');
        }

        return await this.prisma.movimientoCaja.update({
            where:{id},
            data,
        });
    }
}