import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCajaDto } from './dto/create-caja.dto.js';
import { UpdateCajaDto } from './dto/update-caja.dto.js';

@Injectable()
export class CajasService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(){
        return await this.prisma.caja.findMany({
            orderBy:{id:'asc'},
        });
    }

    async findByUser(id:number){
        const existe = await this.prisma.caja.findMany({
            where:{usuarioId:id},
            orderBy:{id:'asc'},
            include:{movimientos:true,},
        });
        if(!existe){
            throw new NotFoundException('No existe una caja con tu usuario');
        }

        return existe;
    }

    async findOne(id:number){
        const existe = await this.prisma.caja.findUnique({
            where:{id},
        });
        if(!existe){
            throw new NotFoundException('No existe una caja con tu usuario');
        }
        return existe;
    }

    async create(usuarioId:number, data:CreateCajaDto){
        return this.prisma.$transaction(async (tx) => {
            const caja = await tx.caja.create({
                data:{
                    montoApertura:data.montoApertura,
                    usuarioId,
                },
            });

            await tx.movimientoCaja.create({
                data:{
                    tipo:'APERTURA',
                    monto:caja.montoApertura,
                    cajaId:caja.id,
                },
            });
        });
    }

    async update(id:number, data:UpdateCajaDto){
        const caja = await this.prisma.caja.findUnique({
            where:{id},
            include:{movimientos:true,},
        });
        if(!caja) throw new NotFoundException('Caja no Encontrada');
        if(caja.estado === 'CERRADA') throw new BadRequestException('La Caja esta Cerrada');

        const montoFinal = caja.movimientos.reduce((total,movimiento) => total + Number(movimiento.monto), 0);
        if(data.montoCierre !== montoFinal) throw new BadRequestException('El Monto Final Ingresado No Coincide con el Esperado');

        return this.prisma.caja.update({
            where:{id},
            data,
        });
    }
}
