import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { Prisma } from '../generated/prisma/client.js';
import { UpdatePedidoDto } from './dto/update-pedido.dto.js';

@Injectable()
export class PedidosService {
    constructor(private readonly prisma:PrismaService){}

    async findAll(){
        return await this.prisma.pedido.findMany({
            orderBy:{id:'asc'},
        });
    }

    async findByClient(userId:number){
        return await this.prisma.pedido.findMany({
            where:{userId},
            include:{pedidoProductos:true,}
        });
    }

    async findOne(id:number){
        const existe = await this.prisma.pedido.findUnique({
            where:{id},
            include:{pedidoProductos:true,},
        });
        if(!existe)throw new NotFoundException('Pedido No Encontrado');

        return existe;
    }

    async create(userId:number, data:CreatePedidoDto){
        return this.prisma.$transaction(async (tx) => {
            const direccion = tx.direccion.findUnique({
                where:{id:data.direccionId},
            });
            if(!direccion)throw new NotFoundException('Direccion No Encontrada');
    //=============================================================================================================================================================
            const productosId = data.pedidoProductos.map(p => p.productoId);
            const productosUnicos = new Set(productosId);
            if(productosUnicos.size !== productosId.length) throw new BadRequestException('No Puedes Repetir De Un Pedido');

            const productosExistentes = await tx.producto.findMany({
                where:{
                    id:{in:productosId,},
                    activo:true,
                },
                orderBy:{id:'asc'},
            });
            if(productosId.length !== productosExistentes.length)throw new NotFoundException('Uno o Mas Productos No Hay En El Almacen');
    //=============================================================================================================================================================
            const detallePedido = [];
            let total = new Prisma.Decimal(0);
            for(const item of data.pedidoProductos){
                const producto = productosExistentes.find(p => item.productoId === p.id);
                if(!producto)throw new NotFoundException('El producto:'+item.productoId+'No existe');
                if(producto.stock < item.cantidad)throw new BadRequestException('No Hay Stock del:'+producto.nombre+'Stock Disponible:'+producto.stock);
            
                const subtotal = producto.precioVenta.mul(item.cantidad);
                total = total.plus(subtotal);
                detallePedido.push({
                    productoId: item.productoId,
                    cantidad:item.cantidad,
                    precioUnitario:producto.precioVenta,
                    subtotal,
                });
            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
                const respuesta = await tx.producto.updateMany({
                    where:{
                        id:item.productoId,
                        stock:{gte:item.cantidad},
                    },
                    data:{
                        stock:{decrement:item.cantidad},
                    },
                });
                if(respuesta.count === 0)throw new BadRequestException('No hay Stock para el producto'+item.productoId);
                await tx.producto.updateMany({
                    where:{
                        id:item.productoId,
                        stock:0,
                    },
                    data:{activo:false,},
                });
            }
    //=====================================================================================================================================================
            const pedido = await tx.pedido.create({
                data:{
                    total,
                    userId,
                    direccionId:data.direccionId,
                },
            });
            await tx.pedidoProducto.createMany({
                data:detallePedido.map(detallePedido => ({
                    pedidoId:pedido.id,
                    productoId:detallePedido.productoId,
                    cantidad:detallePedido.cantidad,
                    precioUnitario:detallePedido.precioUnitario,
                    subtotal:detallePedido.subtotal,
                })),
            });
     //===================================================================================================================================
            return tx.venta.findUnique({
                where:{id:pedido.id},
                include:{ventaProductos:true,},
            });       
        });
    }

    async update(id:number, data:UpdatePedidoDto){
        const existe = await this.prisma.pedido.findUnique({
            where:{id},
        });
        if(!existe)throw new NotFoundException('Pedido No Encontrado');

        return await this.prisma.pedido.update({
            where:{id},
            data,
        });
    }

    async updateClient(id:number,userId:number, data:UpdatePedidoDto){
        const existe = await this.prisma.pedido.findFirst({
            where:{
                id,
                userId,
            },
        });
        if(!existe)throw new NotFoundException('Pedido No Encontrado');
        if(existe.estado !== 'PENDIENTE')throw new BadRequestException('Ya no puedes hacer ningun cambio');
        if(data.estado && data.estado !== 'CANCELADO') throw new BadRequestException('Solo puedes Cancelar el estado');

        if(data.estado === 'CANCELADO'){
            return this.prisma.$transaction(async(tx) => {
                const productos = await tx.pedidoProducto.findMany({
                    where:{pedidoId:id},
                });
                
                for(const producto of productos){
                    await tx.producto.update({
                        where:{id:producto.productoId},
                        data:{
                            stock:{increment:producto.cantidad},
                        },
                    });
                }
                return tx.pedido.update({
                    where:{id},
                    data:{estado:'CANCELADO'}
                });
            });
        }

        return await this.prisma.pedido.update({
            where:{id},
            data,
        });
    }
}
