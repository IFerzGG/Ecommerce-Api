import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoPedido } from '../generated/prisma/enums.js';

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

    async findOne(usuarioId:number){
        const encontrar =null;
    }
}
